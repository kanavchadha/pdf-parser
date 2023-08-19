const dropContainer = document.getElementById("dropcontainer");
const fileInput = document.getElementById("file");
const category = document.getElementById("category");
const type = document.getElementById("type");
const code = document.getElementById("jsoncode");
const codeContainer = document.getElementById('result');
const loader = document.getElementById('loader');

dropContainer.addEventListener("dragover", (e) => {
    // prevent default to allow drop
    e.preventDefault()
}, false)

dropContainer.addEventListener("dragenter", () => {
    dropContainer.classList.add("drag-active")
})

dropContainer.addEventListener("dragleave", () => {
    dropContainer.classList.remove("drag-active")
})

dropContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    dropContainer.classList.remove("drag-active")
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if(e.dataTransfer.files[0].type !== 'application/pdf'){
            return alert('Please select a valid pdf file');
        }
        category.style.display = 'block';
    } else {
        category.style.display = 'none';
    }
    fileInput.files = e.dataTransfer.files
})

fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        category.style.display = 'block';
    } else {
        category.style.display = 'none';
    }
})

category.addEventListener('change', (e) => {
    if (e.target.value === 'expenses') {
        type.style.display = 'block';
    }
})

const uploadFile = async () => {
    if (!fileInput.files || fileInput.files.length <= 0) {
        alert('No File Selected! Please select any valid file.');
        return;
    }
    if(!category.value){
        alert('Please select any valid file category.');
        return;
    }
    if(category.value === 'expenses' && !type.value){
        alert('Please select any valid file type.');
        return;
    }
    try {
        loader.classList.add('active');
        const data = new FormData()
        data.append('file', fileInput.files[0]);
        data.append('category', category.value);
        data.append('type', type.value);
        const res = await fetch('/parse-expenso-file', {
            method: 'POST',
            headers: {
                Accept: "application/json",
            },
            body: data
        });
        const parsedData = await res.json();
        if(parsedData.error){
            throw new Error(parsedData.error);   
        }
        loader.classList.remove('active');
        code.innerText = JSON.stringify(parsedData, null, 4);
        codeContainer.style.display = 'block';
    } catch (error) {
        loader.classList.remove('active');
        alert('Something Went Wrong! ' + error.message);
    }
}

const copyToClipboard = () => {
    const copyText = document.getElementById("jsoncode");
    navigator.clipboard.writeText(copyText.innerText).then(res => {
        alert("Copied the text successfully");
    }).catch(err => {
        alert("Error in Copying text: " + err.message);
    });
}