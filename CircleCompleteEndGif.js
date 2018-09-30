const w = 500, h = 500, nodes = 5

class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += 0.025 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating() {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
        }
    }
}

class CCENode {
    constructor(i) {
        this.i = i
        this.state = new State()

    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new CCENode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context) {
        const gap = h / (nodes + 1)
        const r = gap / 3
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#FF9800'
        context.save()
        context.translate(w/2, this.i * gap + gap)
        for (var j=0; j < 2; j++) {
            const sf = 1 - 2 * j
            const sc = Math.min(0.5, Math.max(0, this.state.scale - 0.5 * j)) * 2
            const sc1 = Math.min(0.5, sc) * 2
            const sc2 = Math.min(0.5, Math.max(0, sc - 0.5)) * 2
            context.save()
            context.scale(sf, 1)
            context.translate((w/2 - r) * sc2, 0)
            context.rotate(Math.PI * sc2)
            context.beginPath()
            for (var k = -90; k <= -90 + 180 * sc1; k++) {
                const x = r * Math.cos(k * Math.PI/180), y = r * Math.sin(k * Math.PI/180)
                if (k == 0) {
                    context.moveTo(x, y)
                } else {
                    context.lineTo(x, y)
                }
            }
            context.stroke()
            context.restore()
        }
        context.restore()
    }

    update(cb) {
        this.state.update(cb)
    }

    startUpdating(cb) {
        this.state.startUpdating(cb)
    }

    getNext(dir, cb) {
        const curr = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}
