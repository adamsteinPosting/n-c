const coincidencePupper = new CoincidencePupper();
coincidencePupper.observer.observe(document.body, {
  childList: true, // observe direct children
  subtree: true
});
