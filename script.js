let btn = document.querySelector("#btn");
let usernameInp = document.querySelector("#usernameInp");
const card = document.querySelector(".card");
const loading = document.querySelector(".loading");

// Fetch the User Data
function fetchProfileData(username) {
  return fetch(`https://api.github.com/users/${username}`)
    .then((rawData) => {
      if (!rawData.ok) throw new Error("Username Not Found❌");
      return rawData.json();
    });
}

// Fetch the User Repository
function userRepository(username) {
  return fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
    .then((rawData) => {
      if (!rawData.ok) throw new Error("Repository not Found❌");
      return rawData.json();
    });
}

// Build profile card
function getDecorateProfile(detail) {
  console.log(detail);

  // Directly populate the card (no nested card)
  let profileData = `
    <img id="avatar" src="${detail.avatar_url}" alt="Avatar" />
    <div class="details">
      <h2 id="name">${detail.name || "N/A"}</h2>
       
      <p><strong>Username:</strong> <span id="userid">${detail.login}</span></p>
      <p><strong>Bio:</strong> <span id="bio">${detail.bio || "N/A"}</span></p>
      <p><strong>Location:</strong> <span id="location">${detail.location || "N/A"}</span></p>
      <p><strong>Joined:</strong> <span id="joinDate">${new Date(detail.created_at).toDateString()}</span></p>
      <p><strong>Followers:</strong> <span id="followers">${detail.followers}</span> | <strong>Following:</strong> <span id="following">${detail.following}</span></p>
      <p><strong>Public Repos:</strong> <span id="publicRepos">${detail.public_repos}</span></p>
      <p><a href="${detail.html_url}" id="githubLink" target="_blank">View GitHub Profile 🔗</a></p>
    </div>
  `;

  card.innerHTML = profileData;
}

btn.addEventListener('click', function (event) {
  event.preventDefault();
  const username = usernameInp.value.trim();
  const loading = document.getElementById("loading");
  card.innerHTML = ""; // clear previous results
  loading.classList.remove("hidden");

  if (username.length > 0) {
    fetchProfileData(username)
      .then((data) => {
        getDecorateProfile(data);
      })
      .catch((err) => {
        alert(err.message);
        card.innerHTML = ""; // Clear on error
      });
       userRepository(username)
      .then((data) => {
        let repoData = "<h3>Repositories:</h3><ul>";
        data.forEach((repo) => {
          repoData += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`;
        });
        repoData += "</ul>";
        card.innerHTML += repoData;
      })
      .catch((err) => {
        alert(err.message);
        card.innerHTML = ""; // Clear on error
      });
  } else {
    alert("Please Enter Username...❗");
  }

  

});
