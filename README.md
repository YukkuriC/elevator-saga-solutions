# YukkuriC's `Elevator Saga`题解们
游戏地址：[Elevator Saga](https://play.elevatorsaga.com/)

## [solution_v1.js](./solution_v1.js)
半拟真运行机制，多个电梯规则相同，尽可能一个方向走到头，且内部按键优先级最大
### 描述
* 非满员时外部同向按键可截停，多个同向电梯时先到先得
* 外部反向按键优先接收当前运行方向最远处楼层，添加至目的队列尾
* 运行时随时更新两方向队列，均有目标时优先完成同向
* 按当前执行队列方向亮起向上/向下灯
* 队列为空时亮起两个灯，并轮询更新
### 性能
* 最大运力(#1-5,#10-11,#16-18)
    * ★★★★☆
    * 少量重开可通过全部关卡
* 最少步数(#6-7)
    * ★★★☆☆
    * 中度依赖RNG
* 最短等待(#8-9,#12-15,#18)
    * ★★☆☆☆
    * 重度依赖RNG，且#14-15不可通过

## [cheats_sonic.js](./cheats_sonic.js)
prototype hack
### 描述
* `Elevator.updateElevatorMovement`20倍速
    * 更高倍数易原地卡死
* `User.moveToOverTime`100倍速
* 步数`Elevator.moveCount`与用户出生时间`User.spawnTimestamp`锁定
### 性能
* ★★★★★
* 0,0,0!