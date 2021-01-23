let root = document.body

let fishlist = list
let collected_fish = new Set()
let sel_season = ""
let sel_weather = ""

let hide_collected = false
let include_any = true

function update_list() {
    fishlist = list.filter(item => {
        if (hide_collected) {
            return !collected_fish.has(item.name)
        }
        return true
    }).filter((item) => {
        if (sel_season) {
            return item.seasons.includes(sel_season) || (item.seasons.includes("Any season") && include_any)
        }
        return true
    }).filter((item) => {
        if (sel_weather) {
            return item.weather === sel_weather || (item.weather === "Any weather" && include_any)
        }
        return true
    })
}

function reset() {
    sel_season = "";
    sel_weather = "";
    fishlist = list;
}

let seasonButton = {
    view: (vnode) => {
        return m("button", {onclick: () => {
                if (sel_season === vnode.attrs.season) {
                        sel_season = ""
                    } else {
                        sel_season = vnode.attrs.season
                    }
                update_list()
                },
                selected: sel_season === vnode.attrs.season,
            }, vnode.attrs.season)
    }
}

let weatherButton = {
    view: (vnode) => {
        return m("button", {onclick: () => {
                if (sel_weather === vnode.attrs.weather) {
                        sel_weather = ""
                    } else {
                        sel_weather = vnode.attrs.weather
                    }
                update_list()
                },
                selected: sel_weather === vnode.attrs.weather,
            }, vnode.attrs.weather)
    }
}

let controls = {
    view: (vnode) => {
        return m(".controls", [
            m(".filter-group", [
                m(seasonButton, {season: "Spring"}),
                m(seasonButton, {season: "Summer"}),
                m(seasonButton, {season: "Fall"}),
                m(seasonButton, {season: "Winter"}),
            ]),
            m(".filter-group", [
                m(weatherButton, {weather: "Sunny"}),
                m(weatherButton, {weather: "Rain"}),
            ]),
            m("input", {type: "checkbox", checked: hide_collected, onclick: () => {
                hide_collected = !hide_collected
                update_list()
            }}),
            m("label", "hide collected"),
            m("input", {type: "checkbox", checked: include_any, onclick: () => {
                include_any = !include_any
                update_list()
            }}),
            m("label", "include any when filtering"),
            m("button.reset", {onclick: reset}, "reset filters"),
        ])
    }
}

let infobox = {
    view: (vnode) => {
        return m(".fish-box", {checked: collected_fish.has(vnode.attrs.fish.name), onclick: (e) => {
            if (collected_fish.has(vnode.attrs.fish.name)) {
                collected_fish.delete(vnode.attrs.fish.name)
            } else {
                collected_fish.add(vnode.attrs.fish.name)
            }
            
            localStorage.setItem("collected_fish", JSON.stringify(Array.from(collected_fish)))

            if (hide_collected) {
                update_list()
            }
        }}, [
            m("div.checkbox"),
            m("img", {src: vnode.attrs.fish.img}),
            m(".fish-name", vnode.attrs.fish.name),
            m(".fish-time", vnode.attrs.fish.time),
            m(".fish-seasons", vnode.attrs.fish.seasons.join(", ")),
            m(".fish-location", vnode.attrs.fish.location),
            m(".fish-weather", vnode.attrs.fish.weather),
        ])
    }
}

let App = {
    view: () => {
        return  [
            m(controls),
            m(".list", fishlist.map((obj) => {
                return m(infobox, {fish: obj})
            })),
            m("p", "Images and info from ", m("a", {href: "https://stardewcommunitywiki.com/Stardew_Valley_Wiki"}, "the Stardew Valley Wiki"), ". All rights reserved.")
        ]
    }
}

window.onload = () => {
    stored_coll_fish = window.localStorage.getItem("collected_fish")

    if (stored_coll_fish) {
        JSON.parse(window.localStorage.getItem("collected_fish")).forEach(element => {
            collected_fish.add(element)
        })
    }

    m.mount(root, App)
}
