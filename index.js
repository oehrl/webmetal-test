var ParticleEmitter = /** @class */ (function () {
    function ParticleEmitter(gpu, maxParticles) {
        this.maxParticles = maxParticles;
        this.spawnRate = 10000;
        this.particlesToSpawn = 0;
        var vertices = new Float32Array(8 * maxParticles);
        this.vertexBuffer = gpu.createBuffer(vertices);
    }
    ParticleEmitter.prototype.update = function (deltaTime) {
        var vertexData = new Float32Array(this.vertexBuffer.contents);
        this.particlesToSpawn += deltaTime * this.spawnRate;
        for (var i = 0; i < this.maxParticles; ++i) {
            var lifetime = vertexData[i * 8 + 3];
            var remainingLifetime = lifetime - deltaTime;
            if (remainingLifetime > 0) {
                // Update position
                for (var j = 0; j < 3; ++j) {
                    vertexData[i * 8 + j] += vertexData[i * 8 + 4 + j] * deltaTime;
                }
                // console.log(i);
                // console.debug("Updated position = (" + vertexData[i * 8 + 0] + "," + vertexData[i * 8 + 1] + "," + vertexData[i * 8 + 2] + ")")
                // Update lifetime
                vertexData[i * 8 + 3] = remainingLifetime;
            }
            else if (this.particlesToSpawn > 1) {
                // Initialize position
                for (var j = 0; j < 3; ++j) {
                    vertexData[i * 8 + j] = 0;
                }
                // Initialize speed
                var squatedLength = void 0;
                do {
                    squatedLength = 0;
                    for (var j = 0; j < 3; ++j) {
                        var directionValue = (Math.random() * 2 - 1);
                        vertexData[i * 8 + 4 + j] = directionValue * 0.2;
                        squatedLength += directionValue * directionValue;
                    }
                } while (squatedLength > 1);
                // Initialize lifetime
                vertexData[i * 8 + 3] = 1 + Math.random();
                --this.particlesToSpawn;
                // console.debug("Spawned particle!");
                // console.debug("Speed = (" + vertexData[i * 8 + 3 + 0] + "," + vertexData[i * 8 + 3 + 1] + "," + vertexData[i * 8 + 3 + 2] + ")")
            }
            else {
                // console.debug("Particles to spawn: " + this.particlesToSpawn);
            }
        }
    };
    ParticleEmitter.prototype.draw = function () {
    };
    return ParticleEmitter;
}());
var ParticleRenderPass = /** @class */ (function () {
    function ParticleRenderPass(app) {
        this.app = app;
        var vertexFunction = app.library.functionWithName("particle_vertex_main");
        var fragmentFunction = app.library.functionWithName("fragment_main");
        this.emitter = new ParticleEmitter(app.gpu, 1000);
        var pipelineDescriptor = new WebMetalRenderPipelineDescriptor();
        pipelineDescriptor.vertexFunction = vertexFunction;
        pipelineDescriptor.fragmentFunction = fragmentFunction;
        // NOTE: Our API proposal has these values as enums, not constant numbers.
        // We haven't got around to implementing the enums yet.
        pipelineDescriptor.colorAttachments[0].pixelFormat = app.gpu.PixelFormatBGRA8Unorm;
        this.renderPipelineState = app.gpu.createRenderPipelineState(pipelineDescriptor);
        this.renderPassDescriptor = new WebMetalRenderPassDescriptor();
        // NOTE: Our API proposal has some of these values as enums, not constant numbers.
        // We haven't got around to implementing the enums yet.
        this.renderPassDescriptor.colorAttachments[0].loadAction = app.gpu.LoadActionClear;
        this.renderPassDescriptor.colorAttachments[0].storeAction = app.gpu.StoreActionStore;
        this.renderPassDescriptor.colorAttachments[0].clearColor = [0.35, 0.65, 0.85, 1.0];
    }
    ParticleRenderPass.prototype.update = function () {
        this.emitter.update(33.33 / 1000);
    };
    ParticleRenderPass.prototype.render = function () {
        CanvasRenderingContext2D;
        var commandBuffer = this.app.commandQueue.createCommandBuffer();
        var drawable = this.app.gpu.nextDrawable();
        this.renderPassDescriptor.colorAttachments[0].texture = drawable.texture;
        var commandEncoder = commandBuffer.createRenderCommandEncoderWithDescriptor(this.renderPassDescriptor);
        commandEncoder.setRenderPipelineState(this.renderPipelineState);
        commandEncoder.setVertexBuffer(this.emitter.vertexBuffer, 0, 0);
        // NOTE: We didn't attach any buffers. We create the geometry in the vertex shader using
        // the vertex ID.
        // NOTE: Our API proposal uses the enum value "triangle" here. We haven't got around to implementing the enums yet.
        commandEncoder.drawPrimitives(this.app.gpu.PrimitiveTypePoint, 0, this.emitter.maxParticles);
        commandEncoder.endEncoding();
        commandBuffer.presentDrawable(drawable);
        commandBuffer.commit();
    };
    return ParticleRenderPass;
}());
var Application = /** @class */ (function () {
    function Application(canvas) {
        this.canvas = canvas;
        this.lastTick = 0;
        this.gpu = canvas.getContext("webmetal");
        if (!this.gpu) {
            throw new Error("Failed to create webmetal context");
        }
        this.commandQueue = this.gpu.createCommandQueue();
        this.library = this.gpu.createLibrary(document.getElementById("library").text);
        this.particleRenderPass = new ParticleRenderPass(this);
        this.lastTick = Date.now();
        setInterval(this.update.bind(this), 1000 / 30); // 30Hz
        this.render();
    }
    Application.prototype.update = function () {
        var now = Date.now();
        var delta = now - this.lastTick;
        this.lastTick = now;
        this.particleRenderPass.update();
    };
    Application.prototype.render = function () {
        this.particleRenderPass.render();
        requestAnimationFrame(this.render.bind(this));
    };
    return Application;
}());
window.onload = function () {
    var app = new Application(document.getElementById("canvas"));
};
// function render(gpu, commandQueue) {
//   requestAnimationFrame(render.bind(this, gpu, commandQueue));
// }
// init();
