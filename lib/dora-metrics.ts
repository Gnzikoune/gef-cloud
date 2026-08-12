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
    const deployments = await octokit.rest.repos.listDeployments({
      owner,
      repo,
      per_page: 100,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDeployments = deployments.data.filter(
      (dep) => dep.created_at && new Date(dep.created_at) > thirtyDaysAgo
    );

    const deploymentFrequency = recentDeployments.length / 30;

    // Lead Time for Changes: Temps moyen entre commit et déploiement (en minutes)
    // Pour simplifier, on utilise le temps entre le dernier commit et le dernier déploiement
    const commits = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 10,
    });

    if (commits.data.length > 0 && recentDeployments.length > 0) {
      const lastCommit = commits.data[0];
      const lastDeployment = recentDeployments[recentDeployments.length - 1];

      if (lastCommit.commit.committer?.date && lastDeployment.created_at) {
        const commitDate = new Date(lastCommit.commit.committer.date);
        const deployDate = new Date(lastDeployment.created_at);
        const leadTimeMinutes = (deployDate.getTime() - commitDate.getTime()) / (1000 * 60);
        var leadTimeForChanges = leadTimeMinutes;
      } else {
        var leadTimeForChanges = 0;
      }
    } else {
      var leadTimeForChanges = 0;
    }

    // Change Failure Rate: Taux de déploiements qui ont échoué
    const failedDeployments = recentDeployments.filter(
      (dep) => dep.status === "failure" || dep.status === "error"
    );

    const changeFailureRate =
      recentDeployments.length > 0
        ? (failedDeployments.length / recentDeployments.length) * 100
        : 0;

    // Time to Restore: Temps moyen pour réparer un incident (en heures)
    // Pour simplifier, on utilise les issues GitHub comme proxy
    const issues = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: "closed",
      labels: "bug,incident",
      per_page: 20,
    });

    const thirtyDaysAgoForIssues = new Date();
    thirtyDaysAgoForIssues.setDate(thirtyDaysAgoForIssues.getDate() - 30);

    const recentIssues = issues.data.filter(
      (issue) =>
        issue.created_at &&
        issue.closed_at &&
        new Date(issue.created_at) > thirtyDaysAgoForIssues
    );

    if (recentIssues.length > 0) {
      const totalRestoreTime = recentIssues.reduce((sum, issue) => {
        if (issue.created_at && issue.closed_at) {
          const created = new Date(issue.created_at);
          const closed = new Date(issue.closed_at);
          return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60);
        }
        return sum;
      }, 0);

      var timeToRestore = totalRestoreTime / recentIssues.length;
    } else {
      var timeToRestore = 0;
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
