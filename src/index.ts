import { ParticleRenderStage } from "./graphics/Particles";
import { RenderPipeline } from "./graphics/RenderPipeline";

class Application {
  readonly renderPipeline: RenderPipeline;
  readonly commandQueue: any;
  readonly library: any;
  private lastTick = 0;
  private particleRenderPass: ParticleRenderStage;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderPipeline = new RenderPipeline(canvas, (document.getElementById("library") as HTMLScriptElement).text);

    this.particleRenderPass = new ParticleRenderStage(this.renderPipeline);

    this.lastTick = Date.now();
    setInterval(this.update.bind(this), 1000 / 30); // 30Hz
    this.render();
  }

  update() {
    const now = Date.now();
    const delta = now - this.lastTick;
    this.lastTick = now;

    this.particleRenderPass.update();
  }

  render() {
    this.particleRenderPass.render();

    requestAnimationFrame(this.render.bind(this));
  }
}

window.onload = () => {
  const app = new Application(document.getElementById("canvas") as HTMLCanvasElement);
}