const coincidencePupper = new CoincidencePupper();

coincidencePupper.textNodesUnder(document.body);

coincidencePupper.observer.observe(document.body, {
  childList: true, // observe direct children
  subtree: true
});
