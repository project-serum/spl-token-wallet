
window.ccai = {
  postMessage: (message) => {
    const listener = (event) => {
      if (event.detail.id === message.id) {
        window.removeEventListener('ccai_contentscript_message', listener);
        window.postMessage(event.detail);
      }
    };
    window.addEventListener('ccai_contentscript_message', listener);

    window.dispatchEvent(
      new CustomEvent('ccai_injected_script_message', { detail: message }),
    );
  },
};
