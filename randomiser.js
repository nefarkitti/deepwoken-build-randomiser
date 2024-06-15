//nef

const talentContainer = document.getElementById("talentContainer")
const modal = document.getElementById("modal")
modal.style.display = "none"

let pointsToSpend = 330
let maxTalents = 75
let totalPointsSpent = 0
let maxAttunements = 1

let claimedAttumenets = []

let talents
let specials
let weapons
let bells

let availableExtra = ["Vitality", "Proficiency", "Erudition", "Songchant"]
let boons = ["Autodidact", "Gourmet", "Maverick", "Packmule", "Scrapper", "Steadfast", "Survivalist", "Sly"]
let flaws = ["Deficient", "Fugitive", "Vegetarian", "Glutton", "Manic", "Haemophilia", "Squeamish", "Obvious", "Blind"]
let allAttunements = ["Flamecharm", "Frostdraw", "Thundercall", "Galebreathe", "Shadowcast", "Ironsing"]

const convert = {

    "HVY": "Heavy Wep.",
    "MED": "Medium Wep.",
    "LHT": "Light Wep.",

    "STR": "Strength",
    "FTD": "Fortitude",
    "AGL": "Agility",
    "INT": "Intelligence",
    "WLL": "Willpower",
    "CHA": "Charisma",

    "FIR": "Flamecharm",
    "ICE": "Frostdraw",
    "THD": "Thundercall",
    "WND": "Galebreathe",
    "SDW": "Shadowcast",
    "MTL": "Ironsing"

}

axios.get('https://raw.githubusercontent.com/nefarkitti/deepwoken-related-things/main/jsons/talents.json').then(res => {
    let jsonData = res.data // should be json by default

    talents = jsonData

    console.log(jsonData)

}).catch(console.error)
axios.get('https://raw.githubusercontent.com/nefarkitti/deepwoken-related-things/main/jsons/special.json').then(res => {
    let jsonData = res.data // should be json by default

    specials = jsonData

    console.log(jsonData)

}).catch(console.error)
axios.get('https://raw.githubusercontent.com/nefarkitti/deepwoken-related-things/main/jsons/weapons.json').then(res => {
    let jsonData = res.data // should be json by default

    weapons = jsonData

    console.log(jsonData)

}).catch(console.error)
axios.get('https://raw.githubusercontent.com/nefarkitti/deepwoken-related-things/main/jsons/bells.json').then(res => {
    let jsonData = res.data // should be json by default

    bells = jsonData

    console.log(jsonData)

}).catch(console.error)

let talentsNames = []

let races = [
    {
        name: "Adret",
        stats: [
            "Charisma: 3",
            "Willpower: 2"
        ]
    },
    {
        name: "Canor",
        stats: [
            "Strength: 3",
            "Charisma: 2"
        ]
    },
    {
        name: "Capra",
        stats: [
            "Intelligence: 3",
            "Willpower: 2"
        ]
    },
    {
        name: "Celtor",
        stats: [
            "Charisma: 3",
            "Intelligence: 2"
        ]
    },
    {
        name: "Chrysid",
        stats: [
            "Charisma: 3",
            "Agility: 2"
        ]
    },
    {
        name: "Etrean",
        stats: [
            "Intelligence: 3",
            "Agility: 2"
        ]
    },
    {
        name: "Felinor",
        stats: [
            "Agility: 3",
            "Charisma: 2"
        ]
    },
    {
        name: "Ganymede",
        stats: [
            "Willpower: 3",
            "Intelligence: 2"
        ]
    },
    {
        name: "Gremor",
        stats: [
            "Fortitude: 3",
            "Strength: 2"
        ]
    },
    {
        name: "Khan",
        stats: [
            "Strength: 3",
            "Agility: 2"
        ]
    },
    {
        name: "Tiran",
        stats: [
            "Agility: 3",
            "Willpower: 2"
        ]
    },
    {
        name: "Vesperian",
        stats: [
            "Fortitude: 3",
            "Willpower: 2"
        ]
    }
]

let build = {

    "Race": "",
    "Weapon": "",
    "Bell": "",

    "Heavy Wep.": 0,
    "Medium Wep.": 0,
    "Light Wep.": 0,

    "Strength": 0,
    "Fortitude": 0,
    "Agility": 0,
    "Intelligence": 0,
    "Willpower": 0,
    "Charisma": 0,

    "Flamecharm": 0,
    "Frostdraw": 0,
    "Thundercall": 0,
    "Galebreathe": 0,
    "Shadowcast": 0,
    "Ironsing": 0,

    "Vitality": 0,
    "Erudition": 0,
    "Proficiency": 0,
    "Songchant": 0,

    "Boon 1": "",
    "Boon 2": "",
    "Flaw 1": "",
    "Flaw 2": "",

    "talents": []

}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

let pool = []
let weaponPool = []

function generateWeaponPool() {

    weaponPool = []

    for (let i = 0; i < weapons.length-1; i++) {

        let reqs = weapons[i].reqs

        let criteria = 0

        reqs.forEach(requirement=>{

            let split = requirement.split(" ")
            //console.log(split)
            let amnt = Number(split[0])
            let attr = split[1]

            let converted = convert[attr]
            if (build[converted] >= amnt) {
                criteria++
            }

        })

        if (criteria == reqs.length) {
            weaponPool.push(weapons[i])
        }

    }

    console.log(weaponPool)

}

function generateCardPool() {

    pool = []

    for (let i = 0; i < talents.length-1; i++) {

        if (talents[i].class != "Outfit") {

            if (talents[i].needs != "None") {
                let count = 0
                //console.log("not none")
                //console.log(talents[i].name)
                //console.log(talents[i].needs.length)
                let ignore = false
    
                talents[i].needs.forEach(need=>{
                    if (need.includes("Oath:") || need.includes("QUEST:") || need.includes("EQUIPMENT")) {
                        ignore = true
                        return
                    }
                }) 
    
                build.talents.forEach(t=>{
                    if (talents[i].needs.includes(t.name)) {
                        count++
                    }
                })
                //console.log(count)
                //console.log("----")
                if (ignore != true) {
                    if (count >= talents[i].needs.length) {
                        if (!talentsNames.includes(talents[i].name)) {
                            pool.push(talents[i])
                        }
                    }
                }
            } else {
                if (!talentsNames.includes(talents[i].name)) {
                    pool.push(talents[i])
                }
            }

        }

    }

}

function grabRandomCard() {

    generateCardPool()

    build["Power"] = 20

    let talent = pool[getRandomInt(0,pool.length)]

    let pointCost = 0

    //console.log(talent)
            
    if (talent.reqs[0] != "") {
        talent.reqs.forEach(requirement=>{
            let split = requirement.split(": ")

            let attr = split[0]
            let cost = split[1]

            if (attr == "Power") {
                cost = 0
            };

            pointCost += Number(cost)

        })
    }
    //console.log(talent)
    if (talentsNames.includes(talent.name)) {
        //console.log(talent.name)
        //console.log("REROLLING DUE TO DUPLICATE")
        return 0
    }

    if ((pointsToSpend - pointCost) >= 1) {

        let totaltalentpointstospend = 0

        let existingAttunementDecline = false

        if (talent.reqs[0] != "") {
            talent.reqs.forEach(requirement=>{
                let split = requirement.split(": ")
    
                let attr = split[0]
                let cost = split[1]

                if (attr == "Power") {
                    cost = 0
                };

                totaltalentpointstospend += Number(cost)

                if (claimedAttumenets.includes(attr) && allAttunements.includes(attr)) {
                    // attuenment already claimed
                    existingAttunementDecline = true
                } else if (allAttunements.includes(attr) && !claimedAttumenets.includes(attr)) {
                    if (claimedAttumenets.length >= maxAttunements) {
                        existingAttunementDecline = true
                    } else {
                        claimedAttumenets.push(attr)
                    }
                }

                if (Number(cost) <= build[attr]) {
                   cost = 0
                }
                
                if (attr != "Power" && existingAttunementDecline == false) {

                    for (let index = 0; index < Number(cost); index++) {
                        
                        if (build[attr] < 100) {
                            build[attr] += 1
                            totalPointsSpent += 1
                            pointsToSpend -= 1
                        }
                    
                    }
    
                }

                build["Power"] = 20
    
            })
            if (existingAttunementDecline == false) {
                talent.totalcost = totaltalentpointstospend
                build.talents.push(talent)
                talentsNames.push(talent.name)
                maxTalents -= 1
            }
        }

    } else {
        build["Power"] = 20
        return 0
    }

    if (pointsToSpend >= 1) {
        build["Power"] = 20
        return 0
    }

}

function displayAll() {

    let k = Object.keys(build)
    talentContainer.innerHTML = ``

    k.forEach(attribute=>{
        if (attribute == "talents") return;
        document.getElementById(attribute).innerHTML = `
                        <span class="name">${attribute}</span>
                        <span class="amnt" title="${build[attribute]}">${build[attribute]}</span>
        `
    })

    talentContainer.innerHTML += `                        <span class="attribute">
                        <span class="name">Name</span>
                        <span class="amnt">Contribution</span>
                        </span>`

    build.talents.forEach(talent=>{

        let fontColour = ""

        if (specials.advanced.includes(talent.name)) {
            fontColour = "#3C7584"
        }
        if (specials.rares.includes(talent.name)) {
            fontColour = "#896060"
        }

        talentContainer.innerHTML += `
                        <span class="attribute" style="color: ${fontColour}">
                        <span class="name">${talent.name}</span>
                        <span class="amnt">${talent.totalcost}</span>
                        </span>
        `

    })

    talentContainer.innerHTML += `<hr>`

    document.getElementById("title").innerHTML = `Talents (${build.talents.length})`
    modal.style.display = "none"

}

function generateBuild() {

    modal.style.display = "flex"

    pointsToSpend = 330
    maxTalents = 75
    totalPointsSpent = 0
    availableExtra = ["Vitality", "Proficiency", "Erudition", "Songchant"]
    boons = ["Autodidact", "Gourmet", "Maverick", "Packmule", "Scrapper", "Steadfast", "Survivalist", "Sly"]
    flaws = ["Deficient", "Fugitive", "Vegetarian", "Glutton", "Manic", "Haemophilia", "Squeamish", "Obvious", "Blind"]
    talentsNames = []
    claimedAttumenets = []
    maxAttunements = getRandomInt(0, 3)
    build = {

        "Race": "None",
        "Weapon": "",
        "Bell": "",

        "Heavy Wep.": 0,
        "Medium Wep.": 0,
        "Light Wep.": 0,
    
        "Strength": 0,
        "Fortitude": 0,
        "Agility": 0,
        "Intelligence": 0,
        "Willpower": 0,
        "Charisma": 0,
    
        "Flamecharm": 0,
        "Frostdraw": 0,
        "Thundercall": 0,
        "Galebreathe": 0,
        "Shadowcast": 0,
        "Ironsing": 0,
    
        "Vitality": 0,
        "Erudition": 0,
        "Proficiency": 0,
        "Songchant": 0,
    
        "Boon 1": "",
        "Boon 2": "",
        "Flaw 1": "",
        "Flaw 2": "",
    
        "talents": []
    
    }

    let race = races[getRandomInt(0, races.length)]

    build.Race = race.name
    race.stats.forEach(requirement=>{
        let split = requirement.split(": ")
    
        let attr = split[0]
        let cost = split[1]

        build[attr] += Number(cost)
        pointsToSpend -= Number(cost)
        totalPointsSpent += Number(cost)
    })

    for (let i = 0; i < 12; i++) {
        
        let random = availableExtra[getRandomInt(0, availableExtra.length)]

        if (build[random] == 6) {
            availableExtra.splice(availableExtra.indexOf(random), 1)
            random = availableExtra[getRandomInt(0, availableExtra.length)]
        }

        build[random] += 1

    }
    for (let i = 0; i < 2; i ++) {

        let randomBoon = boons[getRandomInt(0, boons.length)]
        boons.splice(boons.indexOf(randomBoon), 1)
        
        build[`Boon ${i+1}`] = randomBoon

    }
    for (let i = 0; i < 2; i ++) {

        let randomFlaw = flaws[getRandomInt(0, flaws.length)]
        flaws.splice(flaws.indexOf(randomFlaw), 1)
        
        build[`Flaw ${i+1}`] = randomFlaw

    }

    for (let i = 0; i < 999; i++) {

        grabRandomCard()
        
    }

    build["Power"] = 20
    generateWeaponPool()
    build["Weapon"] = weaponPool[getRandomInt(0, weaponPool.length)].name
    build["Bell"] = bells[getRandomInt(0, bells.length)].name

    displayAll()

    console.log(build)
    //console.log(totalPointsSpent)
    //console.log(talentsNames)

    document.getElementById("total").innerHTML = `total points spent: ${totalPointsSpent}`

}

displayAll()