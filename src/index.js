require('dotenv').config();
import axios from 'axios';
import "./styles.css";

const API_URL = 'https://api.github.com/users/';
const accessToken = process.env.API_KEY;


const itemsPerPage = document.getElementById('page').value;
let currentPage = 1;

const usernameInput = document.getElementById('username');
const repositoriesContainer = document.getElementById('repositories');
const userInfoContainer = document.getElementById('userInfo');
const currentPageElement = document.getElementById('currentPage');
const getReposButton = document.getElementById('getReposButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
function showLoaderForRepositories() {
  const repoLoader = document.getElementById('repoLoader');
  repoLoader.style.display = 'flex';
  repositoriesContainer.style.display='none';// Clear previous repository content
  nextButton.disabled = true;
}

function hideLoaderForRepositories() {
  const repoLoader = document.getElementById('repoLoader');
  repoLoader.style.display = 'none';
  repositoriesContainer.style.display = 'flex';
  nextButton.disabled = false;
}


async function fetchRepositories(username, page) {
  try {
    showLoaderForRepositories();
    const response = await axios.get(`${API_URL}${username}/repos`, {
      params: {
        page,
        per_page: document.getElementById('page').value,
      },
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }finally {
    hideLoaderForRepositories(); // Hide loader for repositories after API call completes
  }
}

async function getRepositoryTopics(username, repoName) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/topics`,{
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      }
    });
    
    return response.data.names;
  } catch (error) {
    console.error(`Error fetching topics for repository ${repoName}:`, error);
    return [];
  }
}

async function getUserInfo(username) {
  try {
    const response = await axios.get(`${API_URL}${username}`,{
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user information:', error);
    return null;
  }
}

function displayUserInfo(userInfo) {
  userInfoContainer.innerHTML = '';

  if (userInfo) {
    const photodiv=document.createElement('div');
    
    const profilePicture = document.createElement('img');
    profilePicture.src = userInfo.avatar_url;
    profilePicture.alt = 'Profile Picture';
    profilePicture.width = 40;
    photodiv.appendChild(profilePicture);
const detaildiv=document.createElement('div');
userInfoContainer.appendChild(detaildiv);
photodiv.style.flex=2;
photodiv.style.alignItems='center';
detaildiv.style.flex=8;


    const nameParagraph = document.createElement('div');
    nameParagraph.textContent = ` ${userInfo.name || 'Not available'}`;
    nameParagraph.style.flex=5;
    nameParagraph.style.fontSize='3em'
    nameParagraph.style.color='#697DEA '
  

    const bioParagraph = document.createElement('div');
    bioParagraph.textContent = `Bio: ${userInfo.bio || 'Not available'}|`;

    const locationParagraph = document.createElement('div');
    locationParagraph.textContent = `Location: ${userInfo.location || 'Not available'}|`;

    const githubLinkParagraph = document.createElement('div');
    const githubLink = document.createElement('a');
    githubLink.href = userInfo.html_url;
    githubLink.target = '_blank';
    githubLink.textContent = userInfo.login;
    githubLinkParagraph.appendChild(document.createTextNode('GitHub URL: '));
    githubLinkParagraph.appendChild(githubLink);

    userInfoContainer.appendChild(photodiv);
    const detailParagraph = document.createElement('div');
    detaildiv.appendChild(nameParagraph);
    
    detaildiv.appendChild(detailParagraph);
 
    detailParagraph.appendChild(bioParagraph);
    detailParagraph.style.flex=5;
    detailParagraph.appendChild(locationParagraph);
    detailParagraph.appendChild(githubLinkParagraph);
  } else {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Error fetching user information';
    userInfoContainer.appendChild(errorMessage);
  }
}

async function displayRepositories(repositories) {
  repositoriesContainer.innerHTML = '';

  if (repositories.length === 0) {
   
    repositoriesContainer.innerHTML = '<p>No repositories found.</p>';
   nextButton.disabled=true
    return;
  }
  
  
  
  
  for (const repo of repositories) {
    const topics = await getRepositoryTopics(repo.owner.login, repo.name);
    
    const repoElement = document.createElement('div');
    repoElement.classList.add('repository');
    repoElement.innerHTML = `
      <div><h3>${repo.name}</h3></div>
      <div><p>${repo.description?(repo.description.length>90?repo.description.substring(0, 90)+' ...':repo.description) : 'No description available.'}</p></div>
    `;

    // Create separate divs for each topic
    const topicsContainer = document.createElement('div');
    topicsContainer.classList.add('topics');
    topicsContainer.style.display='flex';
    
    topicsContainer.style.justifyContent='space-evenly';
    topics.forEach(topic => {
      const topicElement = document.createElement('div');
      topicElement.classList.add('topic');
      topicElement.textContent = topic;
      topicsContainer.appendChild(topicElement);
    });

    repoElement.appendChild(topicsContainer);
    repositoriesContainer.appendChild(repoElement);
    
  }
  nextButton.disabled = false;
}

async function loadPage(direction) {
  if (direction === 'prev' && currentPage > 1) {
    currentPage -= 1;
  } else if (direction === 'next') {
    currentPage += 1;
  }

  const username = usernameInput.value.trim();
  const repositories = await fetchRepositories(username, currentPage);
  displayRepositories(repositories);

  currentPageElement.textContent = `Page ${currentPage}`;

  const userInfo = await getUserInfo(username);
  displayUserInfo(userInfo);
}

async function getRepositories() {
  currentPage = 1;
  const username = usernameInput.value.trim();

  if (username) {
    const repositories = await fetchRepositories(username, currentPage);
    displayRepositories(repositories);

    currentPageElement.textContent = `Page ${currentPage}`;

    const userInfo = await getUserInfo(username);
    displayUserInfo(userInfo);
  } else {
    alert('Please enter a GitHub username.');
  }
}

function handleGetRepositories() {
  getRepositories();
}

function handlePrevPage() {
  loadPage('prev');
}

function handleNextPage() {
  loadPage('next');
}

getReposButton.addEventListener('click', handleGetRepositories);
prevButton.addEventListener('click', handlePrevPage);
nextButton.addEventListener('click', handleNextPage);

document.addEventListener('DOMContentLoaded', function() {
  getRepositories();
});
