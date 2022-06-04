// hacks
{
    // speed up
    var SpeedHack = (clazz, funcName, mult, nparam = 0) => {
        if (clazz.prototype[funcName + 'O']) return
        clazz.prototype[funcName + 'O'] = clazz.prototype[funcName]
        clazz.prototype[funcName] = function (...params) {
            params[nparam] *= mult
            return this[funcName + 'O'](...params)
        }
    }
    SpeedHack(Elevator, 'updateElevatorMovement', 20)
    SpeedHack(User, 'moveToOverTime', 0.01, 2)

    // lock params
    var LockStat = (clazz, propName, value) => {
        try { Object.defineProperty(clazz.prototype, propName, { get: value, set: () => { }, }) }
        catch (e) { }
    }
    LockStat(Elevator, 'moveCount', 0)
    LockStat(User, 'spawnTimestamp', () => world.elapsedTime)
}
// base
var o = {
    init: function (elevators, floors) {
        elevators.forEach((e, i) => e.on(
            'idle',
            () => _.range(floors.length).map(x => e.goToFloor((x + i) % floors.length))
        ))
    },
    update: () => { }
}; o