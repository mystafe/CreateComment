const commentList = document.getElementById("commentList");

let comments = [];

GetComments = async () => {
  let e = await fetch("https://jsonplaceholder.typicode.com/comments");
  return await e.json().then((data) => data.sort((a, b) => b.id - a.id));
};

FillComments = async () => {
  comments = await GetComments();

  FillHtmlComments(comments);
};

FillHtmlComments = (comments) => {
  commentList.innerHTML = "";
  let number = 0;
  let html = "";
  comments.forEach((comment) => {
    html += `
    <div class="comment">
    <div class="deleteBtn" onclick="DeleteComment(event)">  🗑️</div>
    <div class="comment-id" style="visibility:hidden;">${comment.id}</div>
    <div class="comment-name">${comment.name}</div>
    <div class="comment-email">${comment.email}</div>
    <div class="comment-body">${comment.body}</div>
  </div>`;
  });
  commentList.innerHTML = html;
};
FillComments();

CreateComment = async (event) => {
  event.preventDefault();

  let name = createCommentForm.name.value;
  let email = createCommentForm.email.value;
  let body = createCommentForm.body.value;

  let comment = {
    name,
    email,
    body,
  };

  let e = await fetch("https://jsonplaceholder.typicode.com/comments", {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  let result = await e.json();
  result.id = comments[0].id + 1;

  comments = [result, ...comments];

  FillHtmlComments(comments);

  // const commentDiv = document.createElement("div");
  // const html = `
  // <div>  <button class"deleteBtn" onclick="DeleteComment(event)">🗑️</button></div>

  // <div class="comment-id">${result.id}</div>
  //  <div class="comment-name">${result.name}</div>
  //  <div class="comment-email">${result.email}</div>
  //  <div class="comment-body">${result.body}</div>`;

  // commentDiv.innerHTML = html;
  // console.log(commentDiv);
  // commentDiv.classList.add("comment");

  // commentList.insertAdjacentHTML("afterbegin", commentDiv.outerHTML);

  //FillComments();
};

DeleteComment = async (event) => {
  event.preventDefault();

  //confirm
  const choice = confirm("Are you sure you want to delete this comment?");
  if (!choice) {
    return;
  }

  // find the closest div with class comment

  const commentDiv = event.target.closest(".comment");

  // within that div, find the div with class comment-id and get its text content
  const commentId = commentDiv.querySelector(".comment-id").textContent;

  console.log(commentId);

  let e = await fetch(
    `https://jsonplaceholder.typicode.com/comments/${commentId}`,
    {
      method: "DELETE",

      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  let result = await e.json();
  alert("comment is deleted");

  comments = comments.filter((comment) => comment.id != commentId);
  FillHtmlComments(comments);
};
