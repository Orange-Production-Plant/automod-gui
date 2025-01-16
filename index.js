
/**
 * @type {Node.path}
 */
const path = window.nativeapis.path;
const fs = window.nativeapis.fs;



let fileList = []


window.addEventListener("load", ()=>{
    const folderSelectedCallback = (folder) => {
        console.log(folder)
        /**
         * @
         */
        const fileListElement = document.getElementById("filelist");
        
        const files = fs.readdirSync(folder, {"withFileTypes":true});
        

        for (const file of files) {
            
            /**
             * @type {string}
             */
            let fileName = file.name;
            let bits = fileName.split(".")
            fileList.push(bits);

            baseName = bits[0]
            let item = document.createElement("li");
            item.textContent = baseName;
            item.classList.add("listbutton");
    
            fileListElement.appendChild(item);
        }
        let lastButton = fileListElement.lastChild
        lastButton.style.marginBottom = 0;
        
    }

    // DEBUG
    folderSelectedCallback("../source/")
    /*
    window.nativeapis.openDirectoryDialog("Please select automod source files directory")
    window.nativeapis.on("folderSelected", folderSelectedCallback)
    */
})

