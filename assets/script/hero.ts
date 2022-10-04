import * as cc from 'cc'
import { _decorator, Component, CCInteger, EventTouch, Node, misc, Vec3, Vec2, CCBoolean, Prefab, Script } from 'cc'
import { instance, SpeedType } from './Joystick/Joystick'
import type { JoystickDataType } from './Joystick/Joystick'
import { AudioManager } from './audioManager'

const { ccclass, property } = _decorator

@ccclass('Player')
export default class Player extends Component {

    @property({
        type: Prefab,
        displayName: '子弹预制体',
        tooltip: '子弹预制体',
    })
    herobullet:Prefab

    @property({
        type: Node,
        displayName: '子弹管理节点',
        tooltip: '子弹管理节点',
    })
    herobulletNode:Node

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


    _limit_W:number             //屏幕限制w
    _limit_h:number             //屏幕限制h
    moveDir = new Vec3(0, 1, 0)
    _speedType: SpeedType = SpeedType.STOP
    _moveSpeed = 0
    _bulletSpeed = 5;

    onLoad() {
        instance.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        instance.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        instance.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        let gameSize = cc.view.getDesignResolutionSize()
        let node_w = this.getComponent(cc.UITransformComponent).contentSize.width
        let node_h = this.getComponent(cc.UITransformComponent).contentSize.height
        this._limit_W = gameSize.width/2 - node_w/2
        this._limit_h = gameSize.height/2 - node_h/2

        //加载子弹预制体
        this.schedule(function() {
            this.createBullet();
        }, 0.2);

    }



    //创建一颗子弹，并且添加到子弹管理节点
    createBullet()
    {
        let hero_bullet = cc.instantiate(this.herobullet);
        hero_bullet.parent = this.herobulletNode;
        let script = hero_bullet.getComponent('herobullet');

        let name = this.getComponent(cc.Label)
        script.initBullet(name.string, this.node.getPosition(), this._bulletSpeed);

        console.log('chuasdfsdfsdfsdfsdf')
        AudioManager.playSound('fire');
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
        let disvec = this.moveDir.clone().multiplyScalar(this._moveSpeed / 60)
        const newPos = oldPos.add( disvec )
        if(newPos.x < -this._limit_W) newPos.x = -this._limit_W
        if(newPos.x > this._limit_W ) newPos.x = this._limit_W
        if(newPos.y < - this._limit_h) newPos.y = -this._limit_h
        if(newPos.y > this._limit_h) newPos.y = this._limit_h
        
        this.node.setPosition(newPos)
    }

    update(deltaTime: number) {
        if (this._speedType !== SpeedType.STOP) {
            this.move()
        }
    }
}
