class CoincidencePupper {
  private timer: number = 0;
  // in ms, time to throttle responses to new mutations
  private timeout: number = 100;
  public observer: MutationObserver;

  constructor() {
    this.observer = new MutationObserver(() => this.taskRunner());
  }

  public textNodesUnder() {
    // TreeWalker allows us to efficiently iterate the DOM
    var walk = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        // this TreeWalker filter will stop us from affecting pieces
        // of the DOM we don't need or should not alter
        acceptNode: function(node: any) {
          return node.nodeValue.trim() !== "" &&
            node.parentNode.nodeName !== "SCRIPT" &&
            node.parentNode.nodeName !== "STYLE" &&
            node.parentNode.nodeName !== "META" &&
            node.parentNode.nodeName !== "INPUT" &&
            node.parentNode.nodeName !== "FORM" &&
            node.parentNode.nodeName !== "TEXTAREA" &&
            node.parentNode.isContentEditable !== true
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      },
      false
    );

    // the actual iteration over the DOM
    // parsed by the TreeWalker
    while (walk.nextNode()) {
      let tempNode = walk.currentNode;
      let tempText = tempNode.nodeValue!.split(" ");
      let newText: Array<string> = [];
      (function parseText() {
        for (let iterator = 0; iterator < tempText.length; iterator += 1) {
          // no regex, no performance risk
          if (aBunchOfCoincidences.indexOf(tempText[iterator]) !== -1) {
            newText.push(`(((${tempText[iterator]})))`);
          } else {
            newText.push(tempText[iterator]);
          }
        }
      })();
      tempNode.nodeValue = newText.join(" ");
    }
  }

  public taskRunner = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.textNodesUnder();
    }, this.timeout);
  };
}
