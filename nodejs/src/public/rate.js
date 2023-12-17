    
    // Count variables
    let likeCount = 0;
    let dislikeCount = 0;
    // Create Like button
const likeButton = document.createElement('div');
    likeButton.classList.add("glassy-button", "logout-button");
    likeButton.textContent = 'Like';
    likeButton.addEventListener('click', like);

    // Create Dislike button
const dislikeButton = document.createElement('div');
    dislikeButton.classList.add("glassy-button", "game-button");
    dislikeButton.textContent = 'Dislike';
    dislikeButton.addEventListener('click', dislike);

    // Create Like count paragraph
    const likeCountPara = document.createElement('p');
    likeCountPara.id = 'likeCount';
    likeCountPara.textContent = 'Likes: 0';

    // Create Dislike count paragraph
    const dislikeCountPara = document.createElement('p');
    dislikeCountPara.id = 'dislikeCount';
    dislikeCountPara.textContent = 'Dislikes: 0';

    function showRating(element) {
    // Append elements to the body
    element.appendChild(likeCountPara);
    element.appendChild(dislikeCountPara);
    element.appendChild(likeButton);
    element.appendChild(dislikeButton);
    }

    function like() {
      likeCount++;
      updateCounts();
    }

    function dislike() {
      dislikeCount++;
      updateCounts();
    }

    function updateCounts() {
      likeCountPara.textContent = 'Likes: ' + likeCount;
      dislikeCountPara.textContent = 'Dislikes: ' + dislikeCount;
    }