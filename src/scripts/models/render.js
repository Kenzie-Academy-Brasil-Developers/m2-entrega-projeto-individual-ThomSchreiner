import { Api } from "./api.js"
import { Modal } from "./modal.js"

export class Render {
    static async getAllCompanies(user, filter = "Todos") {
        const ul = document.querySelector(".companies__table")
        ul.innerHTML = ""
        const companies = await Api.getAllCompanies()
        this.btnFilterSector(companies, user, filter)

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

        companies.forEach(async (company) => {
            const li = document.createElement("li")
            const guia = ["name", "description", "sectors", "opening_hours"]
            
            if(company.sectors.description == filter || filter == "Todos") {
                guia.forEach((element, i) => {
                    if(user == "admin" && i == 2) {
                        return true
                    }
                    const div = document.createElement("div")
                    const span = document.createElement("span")

                    if(element == "sectors") {
                        span.innerText = company[element].description
                    } else {
                        span.innerText = company[element]
                    }
                    span.classList.add("text-2")
                    div.appendChild(span)
                    li.appendChild(div)
                    ul.appendChild(li)
                })

                if(user == "admin") {
                    await this.getDepartmentsOfOneCompany(company.uuid, li, company.name)
                }
            }
        })
    }

    static btnFilterSector(companies, user, filter) {
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
            
            button.addEventListener("click", (event) => {
                if(event.target.closest("button") !== null) {
                    let sector = event.target.closest("button").innerText
                    sector = sector.split("").filter((element) => isNaN(element))

                    this.getAllCompanies(user, sector.join(""))
                }
            })
        }
    }

    static async getDepartmentsOfOneCompany(companyId, liCompany, companyName) {
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

        liDefault.addEventListener("click", () => Modal.createDepartment(companyName, companyId))

        departments.forEach(department => {
            const li = document.createElement("li")
            const h3 = document.createElement("h3")
            const spanDescription = document.createElement("span")
            const button = document.createElement("button")

            spanDescription.classList.add("text-2")
            button.classList.add("btn__small")

            h3.innerText = department.name
            spanDescription.innerText = department.description
            button.innerText = "Exibir"
            
            li.append(h3, spanDescription, button)
            ul.appendChild(li)

            button.addEventListener("click", () => this.createHomePageUser(department, "admin"))
        })

        liCompany.addEventListener("click", (event) => {
            if(event.target.closest("div") !== null) {
                if(event.target.closest("div").tagName == "DIV") {
                    liCompany.classList.toggle("showDepartments")
                }
            }
        })
    }

    static createHomePageUser(department, user) {
        const mainAdmin = document.querySelector(".main__companies")
        mainAdmin.classList.add("hidden")

        // Company
        const body = document.querySelector("body")
        const mainUser = document.createElement("main")
        const h1 = document.createElement("h1")
        const div = document.createElement("div")
        const h2 = document.createElement("h2")
        const pDescription = document.createElement("p")
        const pOpenHour = document.createElement("p")
        const section = document.createElement("section")

        mainUser.classList.add("page")
        h1.classList.add("title-1")
        h2.classList.add("title-2")
        pDescription.classList.add("text-2")
        pOpenHour.classList.add("text-2")

        h1.innerText = "Empresa"
        h2.innerText = department.companies.name
        pDescription.innerText = department.companies.description
        pOpenHour.innerText = `Abre às ${department.companies.opening_hours}h` 

        div.append(h2, pDescription, pOpenHour)
        mainUser.append(h1, div, section)
        body.appendChild(mainUser)

        // Department
        const divDepartment = document.createElement("div")
        const h3Department = document.createElement("h3")
        const span = document.createElement("span")
        const divFooter = document.createElement("div")
        const buttonEdit = document.createElement("button")
        const buttonDelete = document.createElement("button")

        h3Department.classList.add("title-2")
        span.classList.add("text-1")
        buttonEdit.classList.add("btn", "btn__grey1")
        buttonDelete.classList.add("btn", "btn__red")

        h3Department.innerText = department.name
        span.innerText = department.description
        buttonEdit.innerText = "Editar departamento"
        buttonDelete.innerText = "Deletar"
        buttonEdit.setAttribute("data-control-department", "edit")
        buttonDelete.setAttribute("data-control-department", "delete")

        divFooter.append(buttonEdit, buttonDelete)
        divDepartment.append(h3Department, span, divFooter)
        section.appendChild(divDepartment)
        
        for(let btn of [buttonEdit, buttonDelete]) {
            btn.addEventListener("click", () => {
                Modal[`${btn.getAttribute("data-control-department")}Department`](department)
            })
        }
        
        // Workers
        const divWorker = document.createElement("div")
        const h3Worker = document.createElement("h3")
        const table = document.createElement("table")
       
        divWorker.classList.add("div__worker")
        h3Worker.classList.add("title-2")
        h3Worker.innerText = "Funcionários"

        divWorker.append(h3Worker, table)
        section.appendChild(divWorker)

        if(user == "admin") {
            const span = document.createElement("span")
            const ul = document.createElement("ul")
            ul.classList.add("filter__ul")
            span.innerText = "Filtrar funcionários"

            h3Worker.insertAdjacentElement("afterend", ul)
            h3Worker.insertAdjacentElement("afterend", span)

            this.btnFilterWorker(department, table, user, ul)
        } else {
            this.btnFilterWorker(department, table, user)
        }
    }

    static async btnFilterWorker(department, table, user, ul, departmentFilter = "true") {
        let workers = await Api.getAllWorkers()
        const departmentId = department.uuid
        const filter = { "Ativos neste departamento": 0 , Desempregados: 0 }
       
        workers = workers.filter(worker => {
            if(worker.department_uuid == departmentId) {
                filter["Ativos neste departamento"]++
                if(departmentFilter == "true") {
                    return worker
                }
            } else if(worker.department_uuid == null) {
                filter.Desempregados++
                if(departmentFilter == "false" && worker.username !== "ADMIN") {
                    return worker
                }
            }
        })

        if(user == "admin") {
            ul.innerHTML = ""

            for(let key in filter) {
                const li = document.createElement("li")
                const button = document.createElement("button")
                const smAll = document.createElement("small")
                button.classList.add("btn__small")
                button.innerText = key
                smAll.innerText = filter[key]
    
                if(key == "Ativos neste departamento") {
                    button.setAttribute("data-filter-worker", "true")
                    if(departmentFilter == "true") {
                        button.classList.add("btn__small__active")
                    }
                }
                if(key == "Desempregados") {
                    button.setAttribute("data-filter-worker", "false")
                    if(departmentFilter == "false") {
                        button.classList.add("btn__small__active")
                    }
                }
    
                button.appendChild(smAll)
                li.appendChild(button)
                ul.appendChild(li)
                
    
                button.addEventListener("click", (event) => {
                    if(event.target.closest("button") !== null) {
                        const btnFilter = event.target.closest("button").getAttribute("data-filter-worker")
                        Render.btnFilterWorker(department, table, user, ul, btnFilter)
                    }
                })
            }
        }

        this.createWorkersTable(table, department, workers)
    }

    static createWorkersTable(table, department, workers) {
        table.innerHTML = ""

        const tr1 = document.createElement("tr")
        const th1 = document.createElement("th")
        const th2 = document.createElement("th")
        const th3 = document.createElement("th")

        th1.innerText = "Nome"
        th2.innerText = "Nível profissional"
        th3.innerText = "Tipo de trabalho"
        tr1.append(th1, th2, th3)
        table.appendChild(tr1)

        workers.forEach(worker => {
            const tr = document.createElement("tr")
            const td1 = document.createElement("td")
            const td2 = document.createElement("td")
            const td3 = document.createElement("td")
            const td4 = document.createElement("td")
            const button = document.createElement("button")

            td1.classList.add("text-1")
            td2.classList.add("text-1")
            td3.classList.add("text-1")
            button.classList.add("btn__small")

            td1.innerText = worker.username
            td2.innerText = worker.professional_level
            td3.innerText = worker.kind_of_work
            department.uuid == worker.department_uuid ? button.innerText = "Demitir" : button.innerText = "Contratar"

            td4.appendChild(button)
            tr.append(td1, td2, td3, td4)
            table.appendChild(tr)

            button.addEventListener("click", () => {
                if(department.uuid == worker.department_uuid) {
                    Modal.dismissWorker(worker)
                } else {
                    Modal.hireWorker(department, worker)
                }
            })
        })

        if(table.children.length == 1) {
            th1.innerText = ""
            th2.innerText = "Nenhum funcionário cadastrado"
            th3.innerText = ""
        }
    }
}


