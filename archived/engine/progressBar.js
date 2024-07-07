export class ProgressBar {
  constructor(description, total) {
    this.description = description;
    this.total = total;
    this.current = 0;
    this.barLength = 40; // Fixed length for the progress bar
  }

  update() {
    this.current += 1;
    this.render();
  }

  render() {
    const progress = this.current / this.total;
    const filledBarLength = Math.floor(this.barLength * progress);
    const emptyBarLength = this.barLength - filledBarLength;

    const bar = '█'.repeat(filledBarLength) + '-'.repeat(emptyBarLength);

    // Clear line and render progress bar
    console.clear();
    console.log(`${this.description} [${bar}] ${Math.floor(progress * 100)}%`);
  }
}
