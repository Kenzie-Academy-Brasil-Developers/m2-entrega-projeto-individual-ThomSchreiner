import { Api } from "./api.js"

export class Render {
    static async getAllCompanies(user) {
        const ul = document.querySelector(".companies__table")
        ul.innerHTML = ""
        const companies = await Api.getAllCompanies()
        this.btnFilterSector(companies)

        const liHeader = document.createElement("li")
        const guiaHeader = ["Nome", "Descrição", "Setor", "Hora de abertura"]
        guiaHeader.forEach((element, i) => {
            if(user == "admin" && i == 2) {
                return true
            }
            const div = document.createElement("div")
            const span = document.createElement("span")

            span.innerText = element
            span.classList.add("text-1")
            div.appendChild(span)
            liHeader.appendChild(div)
            ul.appendChild(liHeader)
        })

        companies.forEach(async (companie) => {
            const li = document.createElement("li")
            const guia = ["name", "description", "sectors", "opening_hours"]
            guia.forEach((element, i) => {
                if(user == "admin" && i == 2) {
                    return true
                }
                const div = document.createElement("div")
                const span = document.createElement("span")

                if(element == "sectors") {
                    span.innerText = companie[element].description
                } else {
                    span.innerText = companie[element]
                }
                span.classList.add("text-2")
                div.appendChild(span)
                li.appendChild(div)
                ul.appendChild(li)
            })

            if(user == "admin") {
                await this.getDepartmentsOfOneCompany(companie.uuid, li)
            }
        })
    }

    static btnFilterSector(companies, filter = "Todos") {
        const filterUl = document.querySelector(".filter__ul")
        const sectors = { Todos: 0 }
        filterUl.innerHTML = ""

        companies.forEach(element => {
            sectors[element.sectors.description] = sectors[element.sectors.description] ? sectors[element.sectors.description] + 1 : 1
            sectors.Todos += 1
        })

        for(let key in sectors) {
            const li = document.createElement("li")
            const button = document.createElement("button")
            const smAll = document.createElement("small")
            button.classList.add("btn__small")
            button.innerText = key
            smAll.innerText = sectors[key]

            if(key == filter) {
                button.classList.add("btn__small__active")
            }

            button.appendChild(smAll)
            li.appendChild(button)
            filterUl.appendChild(li)
        }
    }

    static async getDepartmentsOfOneCompany(companyId, liCompany) {
        const departments = await Api.getDepartmentsOfOneCompany(companyId)
        const section = document.createElement("section")
        const ul = document.createElement("ul")

        ul.classList.add("departments__list")
        section.appendChild(ul)
        liCompany.appendChild(section)

        const liDefault = document.createElement("li")
        const buttonDefault = document.createElement("button")
        const spanDefault = document.createElement("span")
        const pDefault = document.createElement("p")

        liDefault.classList.add("btn__create__company")
        pDefault.classList.add("text-2")
        pDefault.innerText = "Criar novo departamento"

        buttonDefault.append(spanDefault, pDefault)
        liDefault.appendChild(buttonDefault)
        ul.appendChild(liDefault)

        departments.forEach(department => {
            const li = document.createElement("li")
            const h3 = document.createElement("h3")
            const spanDescription = document.createElement("span")
            const spanWorkers = document.createElement("span")
            const button = document.createElement("button")

            h3.classList.add("title-2")
            spanDescription.classList.add("text-2")
            spanWorkers.classList.add("text-2")
            button.classList.add("btn__small")

            h3.innerText = department.name
            spanDescription.innerText = department.description
            spanWorkers.innerText = ` Funcionários`
            button.innerText = "Editar"
            
            li.append(h3, spanDescription, spanWorkers, button)
            ul.appendChild(li)
        })
    }
}