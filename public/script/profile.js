let idUnique = 1;

const openFile = event => {

    const input = event.target;
    const reader = new FileReader();
    reader.onload = function () {
        const dataURL = reader.result;
        const output = document.getElementById('output');
        output.src = dataURL;
        document.getElementById("comment").style.opacity = "1";
    };
    reader.readAsDataURL(input.files[0]);
};

document.getElementById("sendComment").addEventListener("click", function (e) {
    e.preventDefault();

    const commentForm = document.forms["commentForm"];
    const commentValue = commentForm.elements["comment"].value;
    if (commentValue !== "") {
        comment(commentValue);
    }
})

function writeComment(res) {
    const containerComment = document.createElement("div");
    const comment = document.createElement("p");
    containerComment.setAttribute('id', `containerComment${idUnique}`);
    comment.setAttribute('class', `commentUser${idUnique}`);
    comment.setAttribute("contenteditable", `false`);
    comment.innerText = res.data.comment;
    document.getElementById("writeComment").appendChild(containerComment);
    document.getElementById(`containerComment${idUnique}`).appendChild(comment);
    document.getElementById(`containerComment${idUnique}`).appendChild(editComment());
    document.getElementById('setComment').value = '';
    idUnique++;
}

function editComment() {
    const editComment = document.createElement("i");
    editComment.setAttribute('class', "far fa-edit  edit");
    return editComment;
}

async function comment(comment) {
    await axios.post('/comment', {
        comment: comment,
    }).then((res) => {
        writeComment(res)
    }).catch((err) => {
        console.log(err);
    })
}

document.getElementById("comment")
    .addEventListener("click", function () {
        document.getElementById("setMessage").style.opacity = "1";
    })

document.getElementById("sendComment").addEventListener("click", function () {
    setTimeout(function () {
        const edit = document.querySelectorAll(".edit");
        Array.from(edit).forEach((value, index) => {
            value.addEventListener("click", function () {
                const thisEdit = this;
                addListener(thisEdit);
            });
        })
    }, 1000)
})

function addListener(thisEdit) {
    const parentId = thisEdit.parentNode.getAttribute("id");
    const getElement = document.getElementById(`${parentId}`).firstChild;
    getElement.style.backgroundColor = "#EBEBEC ";
    getElement.style.borderRadius = "4px";
    const getPresentComment = document.getElementById(`${parentId}`).firstChild.innerHTML;
    getElement.setAttribute("contenteditable", `true`);
    getValueComment(getPresentComment, getElement, parentId);

}

function getValueComment(getPresentComment, element, parentId) {
    element.addEventListener("mouseout", function () {
        const getValueComment = document.getElementById(`${parentId}`).firstChild.innerHTML;
        requestEdit(getPresentComment, getValueComment, element)
    })
}

function requestEdit(presentComment, valueComment, element) {
    axios.post("/comment/edit", {
        presentComment,
        valueComment
    }).then(res=>{
        element.setAttribute("contenteditable", `false`);
        element.style.backgroundColor = "white";
    }).catch(err=>{
        console.log(err);
    })
}






