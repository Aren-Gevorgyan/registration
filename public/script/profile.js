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

document.getElementById("comment")
    .addEventListener("click", function () {
    document.getElementById("setMessage").style.opacity = "1";
})




