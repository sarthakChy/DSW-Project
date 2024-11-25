document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('user') || "Guest";
    document.getElementById('user-name').textContent = user;
  
    const documentList = document.getElementById('document-list');
    const noDocumentsMessage = document.getElementById('no-documents-message');
    const createDocumentLink = document.getElementById('create-document-link');
  
    const fetchDocuments = async () => {
      const url = 'http://localhost:80/api/getDocument.php';
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
  
        const data = await response.json();
  
        if (data?.Documents?.length > 0 || data?.collab?.length > 0) {
          noDocumentsMessage.style.display = 'none';
  
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
          noDocumentsMessage.style.display = 'block';
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
  
    fetchDocuments();
  
    createDocumentLink.href = `Editor.html?docid=${crypto.randomUUID()}`;
  });
  