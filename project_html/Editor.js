document.addEventListener("DOMContentLoaded", function () {
    const socket = new WebSocket('ws://localhost:8080');
    const url = new URL(window.location.href);
    const documentId = url.searchParams.get('docid');
    const documentList = document.getElementById('document-list');
    const user = localStorage.getItem('user') || 'Guest';
    let quill = null;
  
    const toolbarOptions = [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ direction: 'rtl' }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
    ];
  
    const loadDocument = async () => {
      const url = 'http://localhost:80/api/loadDocument.php';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docid: documentId }),
        });

        const data = await response.json();

        if (data) {
          document.getElementById('title').value = data.Title || "Untitled";
          if (data.Content) {
            quill.setContents(data.Content);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const saveDocument = async () => {
      const content = quill.getContents();
      const title = document.getElementById('title').value || "Untitled";
      const url = 'http://localhost:80/api/saveDocument.php';
  
      try {
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: user,
            docid: documentId,
            title: title,
            content: JSON.stringify(content),
            visibility: "Private"
          }),
        });
        
        const data = await response.json();

        alert(data.message);

        setTimeout(()=>{
          window.location.reload();
        },1000);
        
      } catch (error) {
        console.log(error);
      }
    };
  
    const shareDocument = async (sharePerson) => {
      const url = 'http://localhost:80/api/shareDocument.php';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: sharePerson,
            docid: documentId,
            role: "Editor",
          }),
        });
        const data = await response.json();
        alert(data.message || "Document shared successfully!");
      } catch (error) {
        console.error("Error sharing document:", error);
      }
    };

    const fetchDocuments = async () => {
        const url = 'http://localhost:80/api/getDocument.php';
    
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user:user }),
          });
    
          const data = await response.json();
    
          if (data?.Documents?.length > 0 || data?.collab?.length > 0) {
            //noDocumentsMessage.style.display = 'none';
    
            data?.Documents?.forEach(doc => {
              const listItem = document.createElement('li');
              listItem.className = 'document-item';
              listItem.innerHTML = `<a class="styled-link" href="/Editor.html?docid=${doc.DocumentID}">${doc.Title}</a>`;
              documentList.appendChild(listItem);
            });
    
            data?.collab?.forEach(doc => {
              const listItem = document.createElement('li');
              listItem.className = 'document-item';
              listItem.innerHTML = `<a class="styled-link" href="/Editor.html?docid=${doc.DocumentID}">${doc.Title} (Collab)</a>`;
              documentList.appendChild(listItem);
            });
          } else {
            //noDocumentsMessage.style.display = 'block';
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
    };




    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.docId !== documentId) return;
      if (message.delta) {
        quill.updateContents(message.delta, 'silent');
      }
    };
  
    socket.onopen = () => console.log('WebSocket connected');
    socket.onclose = () => console.log('WebSocket disconnected');
  
    const editorContainer = document.getElementById("editor-container");
    const editorElement = document.createElement("div");
    editorContainer.appendChild(editorElement);
  
    quill = new Quill(editorElement, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    });
  
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        const message = { docId: documentId, delta: delta };
        socket.send(JSON.stringify(message));
      }
    });
  
    loadDocument();
    fetchDocuments();
  
    // Save Button
    document.getElementById("saveButton").addEventListener("click", saveDocument);
  
    // Share Button
    document.getElementById("popupButton").addEventListener("click", () => {
      const sharePerson = prompt("Enter username to share:");
      if (sharePerson) shareDocument(sharePerson);
    });
  
    // Home Navigation
    document.getElementById("home-link").addEventListener("click", () => {
      window.location.href = `/Dashboard.html?user=${user}`;
    });
  });
  