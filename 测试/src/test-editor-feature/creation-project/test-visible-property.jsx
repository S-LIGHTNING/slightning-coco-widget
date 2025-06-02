const type = {
    type: "html_widget",
    label: "HTML控件",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABSlBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////lTSb////lSiPnWTTmUSvlTij//v387Of++vnxoYzoZUPypZLzrZr63tb51cz2wrXqcVLmVC798u/4z8Xzqpfsf2Pzr53yp5TqbEzujHPmVjHwm4XnXDj//PvsfF/oYT/rdlj+9/b+9PL98Oz0s6LoXz3paEf75+L64Nn3yr/tg2j87ur40cf7493wmYLvlHz3xbjxnonuh231vK386OP0taT62dD86eT2v7H1uar2wLKbdYiaAAAAM3RSTlMA/FgbNA8L9+r5zsNSTAcE8aeKhby2OgHWyY8s9SDtYOawGNy/lPNAoWbSJRTgmticfHveuFLoAAAIqUlEQVR42s2bZ0MaMRjHDxABAQcqKoqjatW2duUJS9QiIFJEUIYiiICjWu33f1tWkjvuhIO7o/29KnXkb/Ks5Em4ARg3jOi/f54dWze/1wHolsy7Y7Nfv+mdhnFOe0YX9Y7ZebMJRFiW52cd+kUjpx1zBrvDatZBF3Rmq8tumOO04JP987wJZGD58tX2jlOZiZHpMRPIxvJhemRczYW3T5mhT5an7KNqDW+bXYIBMM3o1bDIcfusCQbEMmNTvBAjU+9BmnQ2GriuFIuV60A0mwZplqacilzi3fQqiPFHi6V49SGT2L9K1bnaT2QeqvG7YtQPYszThsH93r4AIqKhy9NwyotwA9QEN/GmEqfxUBRELNgnBnR8xyR0kC+dhZMIYyQJxigZrpby0MGk691Aqz8DQvaegwkvG/wtEd7EfWgPhFid/UeelV0QkLu78ZDRe2nw3Bx1LMXqzkSfvj8tNP7oY8aLkWywN/MqlLDkMPZl/duClJM9yvgw6gvsy7xkgc9UH97wcVbgdaEb9tf3Mws3twK/nPnIyWTRCjzKwRRGA4E99wGBPy7KHF/g/ccZpIBwiT8JYyN9j5+LeTBSAPYc5PgKFmWsP3/+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",
    category: "界面",
    visibleWidget: true,
    global: false,
    emits: [],
    methods: [
        {
            key: "setHTML",
            label: "设置HTML内容",
            params: []
        }
    ],
    props: [
        {
            key: "HTML",
            label: "HTML内容",
            valueType: "string",
            defaultValue: "<i>HTML标签</i>"
        }
    ],
    default: {
        width: 200,
        height: 56
    }
}

class widget extends widgetClass {

    constructor() {
        super()
    }

    setHTML() {
        let count = 0
        setInterval(() => {
            this.setProp("HTML", ++count)
        }, 100)
    }

    render() {
        return <div>{this.props.HTML}</div>;
    }
}

exports.type = type
exports.widget = widget
