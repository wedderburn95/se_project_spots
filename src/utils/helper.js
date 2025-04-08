export function setButtonText(btn, isLoading, loadingText, defaultText) {
  if (isLoading) {
    // set the loading text
    btn.innerText = loadingText;
  } else {
    // set the default text
    btn.innerText = defaultText;
  }
}
