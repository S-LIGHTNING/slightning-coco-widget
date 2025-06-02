/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
const types = {
    type: 'SAMPLE_BLINK_BUTTON_WIDGET',
    icon: 'https://static.codemao.cn/appcraft/extension-widgets/production/blink-button.svg',
    title: '闪烁按钮',
    isInvisibleWidget: false,
    isGlobalWidget: false,
    blockConfig: {
        type: "TEXT_WIDGET",
        category: {
            iconId: "TEXT_WIDGET",
            blocks: "TEXT_WIDGET"
        },
        categoryClass: {
            text: "",
            iconId: "TEXT_WIDGET",
            blocks: []
        },
        getTemplate: function(e) {
            var t = '<field name="WIDGET_ID">'.concat(e, "</field>");
            return ['<block type="text_widget_on_press" uncache="true">\n      '.concat(t, "\n    </block>"), lp, '<block type="text_widget_set_content" uncache="true">\n      '.concat(t, '\n      <value name="CONTENT">\n        <shadow type="text_multiline">\n          <field name="TEXT">').concat(sp.Blink.Msg.TEXT, "</field>\n        </shadow>\n      </value>\n    </block>"), '<block type="text_widget_set_color" uncache="true">\n      '.concat(t, '\n      <value name="COLOR">\n        <shadow type="color_picker"><field name="COLOR_PALETTE">').concat(op.e, "</field></shadow>\n      </value>\n    </block>"), '<block type="text_widget_set_font_size" uncache="true">\n      '.concat(t, '\n      <value name="VALUE">\n        <shadow type="math_number">\n          <field name="NUM" constraints=\'').concat(ad.n, ",,1'>16</field>\n        </shadow>\n      </value>\n    </block>"), '<block type="text_widget_set_align" uncache="true">\n      '.concat(t, "\n    </block>"), lp, Object(cp.sb)({
                    property: "__opacity",
                    widgetType: "TEXT_WIDGET",
                    widgetId: e,
                    isSetProperty: !0
                }), '<block type="text_widget_set_size" uncache="true">\n      '.concat(t, '\n      <field name="SIZE_TYPE">height</field>\n      <value name="NUM">\n        <shadow type="math_number">\n          <field name="NUM" constraints=\'').concat(op.l, ",").concat(op.j, ",1'>100</field>\n        </shadow>\n      </value>\n    </block>"), '<block type="text_widget_set_position" uncache="true">\n        '.concat(t, '\n        <field name="POSITION_TYPE">positionX</field>\n        <value name="NUM">\n          <shadow type="math_number">\n            <field name="NUM" constraints=\',,1\'>100</field>\n          </shadow>\n        </value>\n    </block>'), '<block type="text_widget_set_visible" uncache="true">\n      '.concat(t, "\n    </block>"), lp, "<block type='text_widget_get_content' uncache=\"true\">\n      ".concat(t, "\n    </block>"), "<block type='text_widget_get_color' uncache=\"true\">\n      ".concat(t, "\n    </block>"), "<block type='text_widget_get_font_size' uncache=\"true\">\n      ".concat(t, "\n    </block>"), Object(cp.sb)({
                    property: "__opacity",
                    widgetType: "TEXT_WIDGET",
                    widgetId: e
                }), '<block type="text_widget_get_size" uncache="true">\n      '.concat(t, '\n      <field name="SIZE_TYPE">height</field>\n    </block>'), '<block type="text_widget_get_position" uncache="true">\n      '.concat(t, '\n      <field name="POSITION_TYPE">positionX</field>\n    </block>'), lp, Object(cp.sb)({
                    property: "__visible",
                    widgetType: "TEXT_WIDGET",
                    widgetId: e
            })]
        }
    },
    properties: [
        {
            key: '__width', // 内置属性
            label: '宽度',
            valueType: 'number', // 数字类型
            defaultValue: 68,
        },
        {
            key: '__height', // 内置属性
            label: '高度',
            valueType: 'number', // 数字类型
            defaultValue: 36,
        },
        {
            key: 'content',
            label: '按钮文案',
            valueType: 'string', // 字符串类型
            defaultValue: '按钮',
        },
        {
            key: 'disabled',
            label: '是否禁用',
            valueType: 'boolean', // 布尔类型
            defaultValue: false,
            blockOptions: {
                icon: "https://s-lightning.github.io/res/SLIGHTNING/avatar.png",
                space: 100,
                color: "#00C0FF"
            }
        },
        {
            key: 'mode',
            label: '模式',
            valueType: 'string',
            defaultValue: 'mode1',
            dropdown: [
            // 下拉属性
            { label: '模式一', value: 'mode1' },
            { label: '模式二', value: 'mode2' },
            ],
        },
        {
            key: 'backgroundColor',
            label: '按钮颜色',
            valueType: "string",
            defaultValue: '#1495ef',
        },
        {
            key: 'OptionSwitch',
            label: 'OptionSwitch',
            valueType: 'string',
            editorType: "OptionSwitch",
            defaultValue: 'styleA',
            dropdown: [
                {
                    label: "styleA",
                    value: "styleA"
                }, {
                    label: "styleB",
                    value: "styleB"
                }
            ]
        },
    ],
    methods: [
        {
            key: 'blink',
            label: '开始闪烁',
            params: [
                {
                    key: 'times',
                    label: '次数',
                    get valueType() {
                        return 'number'
                    },
                    controller: {
                        min: 0,
                        max: 5,
                        leftText: "左",
                        rightText: "右"
                    },
                    defaultValue: 0
                },
            ],
            blockOptions: {
                icon: "https://s-lightning.github.io/res/SLIGHTNING/avatar.png",
                space: 100,
                color: "#C00000"
            }
        },
        {
            key: 'getClickCount',
            label: '获取点击次数',
            params: [],
            valueType: 'number', // 方法有返回值
        },
        {
            key: 'getFunction',
            label: '获取函数',
            params: [],
            valueType: 'string', // 方法有返回值
        },
        {
            key: 'checkFunction',
            label: '检查函数',
            params: [
                {
                    key: "function",
                    valueType: "object"
                }
            ]
        },
    ],
    events: [
        {
            key: 'onClick',
            label: '被点击',
            params: [
            {
                key: 'content',
                label: '按钮文案',
                valueType: 'string',
            },
            ],
        },
    ],
};

// 生成随机颜色
function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const color = 'rgba(' + r + ',' + g + ',' + b + ')';
    return color;
}

// debugger

class BlinkButtonWidget extends VisibleWidget {

    // 初始化
    constructor(props) {
        super(props);
        this.content = props.content;
        this.disabled = props.disabled;
        this.mode = props.mode;
        this.backgroundColor = props.backgroundColor;
        this.clickCount = 0;
    }

        // 方法定义，用于事件处理
    onClick = () => {
        this.emit('onClick', this.content);
        this.clickCount++;
    };

    // 方法定义
    blink = (times) => {
        // 开始闪烁
        for (let i = 0; i < times; i++) {
            setTimeout(() => {
            this.setProps({
                backgroundColor: getRandomColor(),
            });
            }, i * 100);
        }
    };

    // 获取按钮点击次数
    getClickCount = () => {
        return this.clickCount;
    };

    getFunction() {
        return () => {
            console.log("这是一个测试函数")
        }
    }

    checkFunction(func) {
        console.log(typeof func, func)
    }

    // 渲染函数
    render() {
        return (
            <button
                onClick={this.onClick}
                disabled={this.disabled}
                style={{
                    background: this.disabled ? '#ccc' : this.backgroundColor,
                    borderRadius: this.mode === 'mode1' ? 5 : 0,
                    fontWeight: this.mode === 'mode1' ? 'bold' : 'normal',
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    color: '#fff',
                }}
            >
            {this.content}
            </button>
        );
    }
}

  exports.types = types;
  exports.widget = BlinkButtonWidget;
