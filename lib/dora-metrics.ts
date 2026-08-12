import { Octokit } from "octokit";

interface DORAMetrics {
  deploymentFrequency: number;
  leadTimeForChanges: number;
  changeFailureRate: number;
  timeToRestore: number;
}

export async function calculateDORAMetrics(
  owner: string,
  repo: string,
  accessToken: string
): Promise<DORAMetrics> {
  const octokit = new Octokit({ auth: accessToken });

  try {
    // Deployment Frequency: Nombre de déploiements par jour (sur les 30 derniers jours)
    // Note: public_repo scope n'a pas accès aux deployments, donc on utilise commits comme proxy
    const commits = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 100,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCommits = commits.data.filter(
      (commit) => commit.commit.committer?.date && new Date(commit.commit.committer.date) > thirtyDaysAgo
    );

    const deploymentFrequency = recentCommits.length / 30;

    // Lead Time for Changes: Temps moyen entre commit et merge PR (en minutes)
    // Pour les repos publics, on utilise les PRs comme proxy
    const pullRequests = await octokit.rest.pulls.list({
      owner,
      repo,
      state: "closed",
      per_page: 50,
    });

    const recentPRs = pullRequests.data.filter(
      (pr) => pr.created_at && pr.merged_at && new Date(pr.created_at) > thirtyDaysAgo
    );

    let leadTimeForChanges = 0;
    if (recentPRs.length > 0) {
      const totalLeadTime = recentPRs.reduce((sum, pr) => {
        if (pr.created_at && pr.merged_at) {
          const created = new Date(pr.created_at);
          const merged = new Date(pr.merged_at);
          return sum + (merged.getTime() - created.getTime()) / (1000 * 60);
        }
        return sum;
      }, 0);
      leadTimeForChanges = totalLeadTime / recentPRs.length;
    }

    // Change Failure Rate: Taux de PRs fermés sans merge (proxy pour échecs)
    const failedPRs = pullRequests.data.filter(
      (pr) => pr.state === "closed" && !pr.merged_at && pr.created_at && new Date(pr.created_at) > thirtyDaysAgo
    );

    const changeFailureRate =
      recentPRs.length > 0
        ? (failedPRs.length / (recentPRs.length + failedPRs.length)) * 100
        : 0;

    // Time to Restore: Temps moyen pour fermer une issue (en heures)
    const issues = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: "closed",
      per_page: 50,
    });

    const recentIssues = issues.data.filter(
      (issue) =>
        issue.created_at &&
        issue.closed_at &&
        new Date(issue.created_at) > thirtyDaysAgo
    );

    let timeToRestore = 0;
    if (recentIssues.length > 0) {
      const totalRestoreTime = recentIssues.reduce((sum, issue) => {
        if (issue.created_at && issue.closed_at) {
          const created = new Date(issue.created_at);
          const closed = new Date(issue.closed_at);
          return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60);
        }
        return sum;
      }, 0);
      timeToRestore = totalRestoreTime / recentIssues.length;
    }

    return {
      deploymentFrequency: Math.round(deploymentFrequency * 100) / 100,
      leadTimeForChanges: Math.round(leadTimeForChanges),
      changeFailureRate: Math.round(changeFailureRate * 100) / 100,
      timeToRestore: Math.round(timeToRestore * 100) / 100,
    };
  } catch (error) {
    console.error("Error calculating DORA metrics:", error);
    return {
      deploymentFrequency: 0,
      leadTimeForChanges: 0,
      changeFailureRate: 0,
      timeToRestore: 0,
    };
  }
}
