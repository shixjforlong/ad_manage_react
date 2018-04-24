export function filedownload(data, filename, mime, url) {
  if (
    typeof window.navigator.msSaveBlob !== 'undefined' &&
    typeof url !== 'undefined' &&
    url !== ''
  ) {
    const blob = new Blob([data], { type: mime || 'application/octet-stream' });
    window.navigator.msSaveBlob(blob, filename);
  } else {
    let blobURL = '';
    if (url) {
      blobURL = url;
    } else {
      const blob = new Blob([data], {
        type: mime || 'application/octet-stream',
      });
      blobURL = window.URL.createObjectURL(blob);
    }
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
  return null;
}
