class CoincidencePupper {
  private timer: number = 0;
  // in ms, time to throttle responses to new mutations
  private timeout: number = 100;
  // private masterList: Array<string>;
  private constructedList: RegExp;

  private capturedNodeList: Array<any> = [];
  public observer: MutationObserver;

  constructor() {
    // this.masterList = aBunchOfCoincidences.concat(someMoreCoincidences);
    this.constructedList = new RegExp(
      `(${someMoreCoincidences.join("|")})`,
      ""
    );
    this.observer = new MutationObserver(this.taskRunner);
  }

  public textNodesUnder(target: any) {
    // const perf1 = performance.now();
    // TreeWalker allows us to efficiently iterate the DOM
    var walk = document.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT,
      {
        // this TreeWalker filter will stop us from affecting pieces
        // of the DOM we don't need or should not alter
        acceptNode: (node: any) => {
          return node.parentNode.nodeName !== "SCRIPT" &&
            node.parentNode.nodeName !== "STYLE" &&
            node.parentNode.nodeName !== "META" &&
            node.parentNode.nodeName !== "INPUT" &&
            node.parentNode.nodeName !== "FORM" &&
            node.parentNode.nodeName !== "TEXTAREA" &&
            node.parentNode.isContentEditable !== true && 
            node.nodeValue.trim().length > 3
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
      let tempText: any = tempNode.nodeValue;

      if (!tempText.includes("(((")) {
        tempNode.nodeValue = tempText.replace(
          this.constructedList,
          "(((" + "$1" + ")))"
        );
      }
    }
    // console.log(performance.now() - perf1 + ' ms to parse ' + target + '.')
  }

  private mutationRecord(mutations: any) {
    for (let mutation of mutations) {
      for (let nodes of mutation.addedNodes) {
        this.capturedNodeList.push(nodes);
      }
    }
  }

  public taskRunner = (mutations: any) => {
    this.mutationRecord(mutations);

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      for (let node of this.capturedNodeList) {
        this.textNodesUnder(node);
      }
      this.capturedNodeList = [];
    }, this.timeout);
  };
}
