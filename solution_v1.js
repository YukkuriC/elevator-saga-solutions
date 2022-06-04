var o = {
    init: function (elevators, floors) {
        elevators.forEach((e, idx) => {
            e.idx = idx
            e.on('idle floor_button_pressed passing_floor', () => {
                var q = {}
                for (var dir of ['up', 'down'])
                    q[dir] = getQueue(e, dir)
                // pick a queue
                var newQueue = null
                if (e.lastDir) {
                    if ((q[e.lastDir].length) > 0)
                        newQueue = q[e.lastDir]
                }
                if (!newQueue) {
                    for (var qq of Object.values(q)) {
                        if (qq.length > 0) {
                            newQueue = qq
                            break
                        }
                    }
                }
                // apply queue
                if (newQueue) {
                    if (newQueue[0] > e.currentFloor()) {
                        e.goingUpIndicator(true)
                        e.goingDownIndicator(false)
                    } else {
                        e.goingUpIndicator(false)
                        e.goingDownIndicator(true)
                    }
                    e.destinationQueue = newQueue
                    e.checkDestinationQueue()
                } else {
                    e.goingUpIndicator(true)
                    e.goingDownIndicator(true)
                    setTimeout(() => {
                        e.trigger('idle')
                    }, 100 * Math.random());
                }
            })
            e.on('stopped_at_floor', (fi) => {
                e.trigger('idle')
                if (e.goingUpIndicator())
                    floors[fi].req.up = false
                if (e.goingDownIndicator())
                    floors[fi].req.down = false
            })
        })
        floors.forEach(f => {
            f.req = {}
            f.on("up_button_pressed", () => f.req.up = true)
            f.on("down_button_pressed", () => f.req.down = true)
        })

        window.check = () => floors.map(x => x.req)

        function getQueue(elevator, direction) {
            var df = direction == 'up' ? 1 : -1
            var queue = []
            var ownedFloors = getOwnedFloors(elevator, direction)
            var pressed = elevator.getPressedFloors()
            var oppoFloor = null
            for (var i = elevator.currentFloor() + df; i >= 0 && i < floors.length; i += df) {
                if (pressed.indexOf(i) >= 0) queue.push(i)
                else if (floors[i].req[direction] && !ownedFloors[i] && elevator.loadFactor() < 1) queue.push(i)
                else if (floors[i].req[oppoDir(direction)] && !ownedFloors[i]) oppoFloor = i
            }
            if (typeof oppoFloor == 'number') queue.push(oppoFloor)
            return queue
        }

        function getOwnedFloors(elevator, direction) {
            var res = {}
            for (var e of elevators) {
                if (e.idx == elevator.idx || e.lastDir != direction) continue
                for (var f of e.destinationQueue)
                    res[f] = true
            }
            return res
        }

        function oppoDir(direction) {
            if (direction == 'up') return 'down'
            return 'up'
        }
    },
    update: (dt, elevators, floors) => {
        for (var e of elevators) {
            var stat = e.destinationDirection()
            if (stat == 'up' || stat == 'down') e.lastDir = stat
        }
    }
}; o