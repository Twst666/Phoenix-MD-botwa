const axios = require('axios');

module.exports = {
    name: "git",
    aliases: ["git", "repo"],
    category: "main",
    desc: "show information about a GitHub repository",
    async exec({ msg, client }) {
        const githubRepoURL = 'https://github.com/Loki-Xer/Jarvis-md';

        try {
            const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

            const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

            if (response.status === 200) {
                const repoData = response.data;

                const formattedInfo = `
📂 Repo Name : ${repoData.name}
👤 Repo Owner : ${repoData.owner.login}
🍴 Repo Forks : ${repoData.forks_count}
⭐ Repo Stars : ${repoData.stargazers_count}
📝 Repo Description : ${repoData.description}
🌐 Repo URL : ${repoData.html_url}
                `.trim();

                await client.sendMessage(msg.from, formattedInfo);
            } else {
                await client.sendMessage(msg.from, `GitHub API request failed with status code: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
            await client.sendMessage(msg.from, 'An error occurred while fetching repository information.');
        }
    }
};
 
