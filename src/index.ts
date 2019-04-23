// class ParticleEmitter {
//   vertexBuffer;
//   private spawnRate = 10000;
//   private particlesToSpawn = 0;

//   constructor(gpu, readonly maxParticles: number) {
//     const vertices = new Float32Array(8 * maxParticles);
//     this.vertexBuffer = gpu.createBuffer(vertices);
//   }

//   update(deltaTime: number) {
//     const vertexData = new Float32Array(this.vertexBuffer.contents);
//     this.particlesToSpawn += deltaTime * this.spawnRate;

//     for (let i = 0; i < this.maxParticles; ++i) {
//       const lifetime = vertexData[i * 8 + 3];
//       const remainingLifetime = lifetime - deltaTime;
//       if (remainingLifetime > 0) {
//         // Update position
//         for (let j = 0; j < 3; ++j) {
//           vertexData[i * 8 + j] += vertexData[i * 8 + 4 + j] * deltaTime;
//         }
//         // console.log(i);
//         // console.debug("Updated position = (" + vertexData[i * 8 + 0] + "," + vertexData[i * 8 + 1] + "," + vertexData[i * 8 + 2] + ")")

//         // Update lifetime
//         vertexData[i * 8 + 3] = remainingLifetime;
//       } else if (this.particlesToSpawn > 1) {
//         // Initialize position
//         for (let j = 0; j < 3; ++j) {
//           vertexData[i * 8 + j] = 0;
//         }
//         // Initialize speed
//         let squatedLength;
//         do {
//           squatedLength = 0;
//           for (let j = 0; j < 3; ++j) {
//             const directionValue = (Math.random() * 2 - 1);
//             vertexData[i * 8 + 4 + j] = directionValue * 0.2;
//             squatedLength += directionValue * directionValue;
//           }
//         } while (squatedLength > 1);

//         // Initialize lifetime
//         vertexData[i * 8 + 3] = 1 + Math.random();
//         --this.particlesToSpawn;

//         // console.debug("Spawned particle!");
//         // console.debug("Speed = (" + vertexData[i * 8 + 3 + 0] + "," + vertexData[i * 8 + 3 + 1] + "," + vertexData[i * 8 + 3 + 2] + ")")
//       } else {
//         // console.debug("Particles to spawn: " + this.particlesToSpawn);
//       }
//     }
//   }

//   draw() {

//   }
// }

// class ParticleRenderPass {
//   private renderPipelineState;
//   private renderPassDescriptor;
//   private emitter: ParticleEmitter;

//   constructor(private app: Application) {
//     const vertexFunction = app.library.functionWithName("particle_vertex_main");
//     const fragmentFunction = app.library.functionWithName("fragment_main");

//     this.emitter = new ParticleEmitter(app.gpu, 1000);

//     const pipelineDescriptor = new WebMetalRenderPipelineDescriptor();
//     pipelineDescriptor.vertexFunction = vertexFunction;
//     pipelineDescriptor.fragmentFunction = fragmentFunction;
//     // NOTE: Our API proposal has these values as enums, not constant numbers.
//     // We haven't got around to implementing the enums yet.
//     pipelineDescriptor.colorAttachments[0].pixelFormat = app.gpu.PixelFormatBGRA8Unorm;

//     this.renderPipelineState = app.gpu.createRenderPipelineState(pipelineDescriptor);

//     this.renderPassDescriptor = new WebMetalRenderPassDescriptor();
//     // NOTE: Our API proposal has some of these values as enums, not constant numbers.
//     // We haven't got around to implementing the enums yet.
//     this.renderPassDescriptor.colorAttachments[0].loadAction = app.gpu.LoadActionClear;
//     this.renderPassDescriptor.colorAttachments[0].storeAction = app.gpu.StoreActionStore;
//     this.renderPassDescriptor.colorAttachments[0].clearColor = [0.35, 0.65, 0.85, 1.0];
//   }

//   update() {
//     this.emitter.update(33.33 / 1000);
//   }

//   render() {
//     CanvasRenderingContext2D
//     const commandBuffer = this.app.commandQueue.createCommandBuffer();
//     const drawable = this.app.gpu.nextDrawable();
//     this.renderPassDescriptor.colorAttachments[0].texture = drawable.texture;

//     const commandEncoder = commandBuffer.createRenderCommandEncoderWithDescriptor(this.renderPassDescriptor);
//     commandEncoder.setRenderPipelineState(this.renderPipelineState);
//     commandEncoder.setVertexBuffer(this.emitter.vertexBuffer, 0, 0);

//     // NOTE: We didn't attach any buffers. We create the geometry in the vertex shader using
//     // the vertex ID.

//     // NOTE: Our API proposal uses the enum value "triangle" here. We haven't got around to implementing the enums yet.
//     commandEncoder.drawPrimitives(this.app.gpu.PrimitiveTypePoint, 0, this.emitter.maxParticles);

//     commandEncoder.endEncoding();
//     commandBuffer.presentDrawable(drawable);
//     commandBuffer.commit();
//   }
// }

// class Application {
//   readonly gpu;
//   readonly commandQueue;
//   readonly library;
//   private lastTick = 0;
//   private particleRenderPass: ParticleRenderPass;

//   constructor(private canvas: HTMLCanvasElement) {
//     this.gpu = canvas.getContext("webmetal");
//     if (!this.gpu) {
//       throw new Error("Failed to create webmetal context");
//     }

//     this.commandQueue = this.gpu.createCommandQueue();
//     this.library = this.gpu.createLibrary(document.getElementById("library").text);

//     this.particleRenderPass = new ParticleRenderPass(this);

//     this.lastTick = Date.now();
//     setInterval(this.update.bind(this), 1000 / 30); // 30Hz
//     this.render();
//   }

//   update() {
//     const now = Date.now();
//     const delta = now - this.lastTick;
//     this.lastTick = now;

//     this.particleRenderPass.update();
//   }

//   render() {
//     this.particleRenderPass.render();

//     requestAnimationFrame(this.render.bind(this));
//   }
// }

// window.onload = () => {
//   const app = new Application(document.getElementById("canvas") as HTMLCanvasElement);
// }

console.log("Hello World!");