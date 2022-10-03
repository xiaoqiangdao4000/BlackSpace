import { _decorator, Component, CCInteger, EventTouch, Node, misc, Vec3, Vec2, CCBoolean } from 'cc'
import { instance, SpeedType } from './Joystick/Joystick'
import type { JoystickDataType } from './Joystick/Joystick'

const { ccclass, property } = _decorator

@ccclass('Player')
export default class Player extends Component {
    @property({
        type: CCInteger,
        tooltip: 'Speed at stop.',
    })
    stopSpeed = 0

    @property({
        type: CCInteger,
        tooltip: 'Normal speed.',
    })
    normalSpeed = 100

    @property({
        type: CCInteger,
        tooltip: 'Fast speed.',
    })
    fastSpeed = 200

    @property({
        tooltip: '旋转',
    })
    isRotate = true
    moveDir = new Vec3(0, 1, 0)
    _speedType: SpeedType = SpeedType.STOP
    _moveSpeed = 0

    onLoad() {
        instance.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        instance.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        instance.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    onTouchStart() { }

    onTouchMove(event: EventTouch, data: JoystickDataType) {
        this._speedType = data.speedType
        this.moveDir = data.moveVec
        this.onSetMoveSpeed(this._speedType)
    }

    onTouchEnd(event: EventTouch, data: JoystickDataType) {
        this._speedType = data.speedType
        this.onSetMoveSpeed(this._speedType)
    }

    /**
     * set moveSpeed by SpeedType
     * @param speedType
     */
    onSetMoveSpeed(speedType: SpeedType) {
        switch (speedType) {
            case SpeedType.STOP:
                this._moveSpeed = this.stopSpeed
                break
            case SpeedType.NORMAL:
                this._moveSpeed = this.normalSpeed
                break
            case SpeedType.FAST:
                this._moveSpeed = this.fastSpeed
                break
            default:
                break
        }
    }

    /**
     * Movement
     */
    move() {
        if(this.isRotate)
        {
            this.node.angle = misc.radiansToDegrees(Math.atan2(this.moveDir.y, this.moveDir.x)) - 90
        }
        
        const oldPos = this.node.getPosition()
        const newPos = oldPos.add(
            // fps: 60
            this.moveDir.clone().multiplyScalar(this._moveSpeed / 60)
        )
        console.log(this._moveSpeed / 60)
        this.node.setPosition(newPos)

        console.log(newPos)

    }

    update(deltaTime: number) {
        if (this._speedType !== SpeedType.STOP) {
            this.move()
        }
    }
}
