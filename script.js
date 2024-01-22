let globalUserData = {}

let savedUsers = JSON.parse(window.localStorage.getItem('saved-users')) || []
console.log(savedUsers)

let populateThis = '<option value="None">None</option>'
savedUsers.forEach(user => {
    console.log(user)
    populateThis+=`<option value=${user}>${user}</option>`
})

const loader = document.createElement('div')
loader.innerHTML = 'Loading...'

document.getElementById('saved-users-select').innerHTML = populateThis

document.getElementById('save-current').addEventListener('click',()=>{
    const currUser = globalUserData.login || ''

    if(currUser==='') return;

    if (!savedUsers.includes(currUser)) {
        savedUsers.push(currUser);
        window.localStorage.setItem('saved-users', JSON.stringify(savedUsers));
    }
    
    let populateThis = '<option value="None">None</option>'
    savedUsers.forEach(user => {
        console.log(user)
        populateThis+=`<option value=${user}>${user}</option>`
    })

    document.getElementById('saved-users-select').innerHTML = populateThis
    
})




document.getElementById('saved-users-select').addEventListener('change',()=>{
    const selectedUser = document.getElementById('saved-users-select').value
    document.getElementById('user-search-input').value = selectedUser
})

const getRepositories = async (data) => {
    
    let reposWrapper = document.getElementById('repos-id')
    
    const page = document.getElementById('page').value;
    const limit = document.getElementById('limit').value;
    const rep_response = await fetch(`https://github-finder-qts6.onrender.com/repos?uname=${data.login}&page=${page}&limit=${limit}`)
    const repos = await rep_response.json()
    
    reposWrapper.innerHTM = ''
    repos.data.forEach(repo => {
        reposWrapper.innerHTML += `
        <a class="card" href=${repo.html_url} target='_blank'>
            <div class="repo-name">${repo.name}</div>
            <div class="repo-desc">${repo.description}</div>
            <ul class="repo-tags-wrapper">
                <li class="repo-tags">Javascript</li>
                <li class="repo-tags">HTML</li>
                <li class="repo-tags">CSS</li>
            </ul>
        </a>
        `
    })
    console.log(repos.data)

}

const getUserRepository = async ()=>{
    const repoName = document.getElementById('repo-search-input').value
    try {

        let reposWrapper = document.getElementById('repos-id')
        reposWrapper.innerHTML='<div>Loading</div>'
        const rep_response = await fetch(`https://api.github.com/repos/${globalUserData.login}/${repoName}`)
        const repo = await rep_response.json()
        reposWrapper.innerHTML = `
        <a class="card" href=${repo.html_url} target='_blank'>
            <div class="repo-name">${repo.name}</div>
            <div class="repo-desc">${repo.description}</div>
            <ul class="repo-tags-wrapper">
                <li class="repo-tags">Javascript</li>
                <li class="repo-tags">HTML</li>
                <li class="repo-tags">CSS</li>
            </ul>
        </a>
        `
    } catch (error) {
        console.log(error)
    }
}

document.getElementById("repo-search").addEventListener('click',async()=>{
    await getUserRepository()
})

document.getElementById('LP-search').addEventListener('click', async() => {
    getRepositories(globalUserData)
})




document.getElementById('search-user').addEventListener('click', async ()=>{
    const username = document.getElementById('user-search-input').value
    const url = 'https://api.github.com/users/' + username
    const loaddd = document.getElementById("user-wrapper-id")
    
    loaddd.innerHTML = '<div class="user-details">Loading</div>'
    
    const response = await fetch(url)
    const data = await response.json()
    
    //** GETTING THE REPOSITORIES */
    globalUserData = data
    getRepositories(data)

    const wrapper = document.getElementById('user-wrapper-id')
    wrapper.innerHTML = 
    `
    <div class="user-details">
            <img class="user-image" src=${data.avatar_url} alt="">
            <div class="user-specification">
                <span class="name">${data.name}</span>
                <div class="bio">${data.bio}</div>
                <div class="location-wrapper">
                    <img src="./location img.png" alt="" srcset="" class="location-logo">
                    <div class="location"> ${data.location} </div>
                </div>
                <a href=${data.url} class="link">${data.url}</a>
            </div>
        </div>
        <div class="user-details">
            
        </div>

    `

    console.log(data)
})
