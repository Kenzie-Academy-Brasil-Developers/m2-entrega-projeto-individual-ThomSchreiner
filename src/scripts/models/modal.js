import { Api } from "./api.js"
import { Toast } from "./toast.js"

export class Modal {
    static baseStructure() {
        const body = document.querySelector("body")
        const section = document.createElement("section")

        section.classList.add("modal")
        body.appendChild(section)

        section.addEventListener("click", (event) => {
            if(event.target.tagName == "SECTION") {
                event.target.remove()
            }
        })
        return section
    }

    static async createCompany() {
        const section = this.baseStructure()
        const sectors = await Api.getAllSectors()
        const form = document.createElement("form")
        const h2 = document.createElement("h2")
        const inputName = document.createElement("input")
        const inputOpenHour = document.createElement("input")
        const select = document.createElement("select")
        const inputDescription = document.createElement("input")
        const button = document.createElement("button")

        h2.classList.add("title-2")
        inputName.classList.add("input")
        inputOpenHour.classList.add("input")
        inputDescription.classList.add("input")
        button.classList.add("btn")

        select.setAttribute("required", true)
        inputName.setAttribute("required", true)
        inputOpenHour.setAttribute("required", true)
        inputDescription.setAttribute("required", true)
        inputOpenHour.type = "time"
        
        h2.innerText = `Criar nova empresa`
        inputName.placeholder = "Nome da empresa"
        inputOpenHour.placeholder = "Hora de abertura da empresa"
        inputDescription.placeholder = "Descrição / Slogan"
        button.innerText = "Criar empresa"
        
        sectors.forEach((element, i) => {
            if(i == 0) {
                const optionDefault = document.createElement("option")
                optionDefault.innerText = "Selecione o setor"
                optionDefault.value = ""
                optionDefault.setAttribute("selected", true)
                optionDefault.setAttribute("disabled", true)
                optionDefault.setAttribute("hidden", true)
                select.appendChild(optionDefault)
            }

            const option = document.createElement("option")
            option.innerText = element.description
            option.value = element.uuid
            select.appendChild(option)
        })
        form.append(h2, inputName, inputDescription, select, inputOpenHour, button)
        section.appendChild(form)
        
        form.addEventListener("submit", (event) => {
            event.preventDefault()
            const body = {
                name: inputName.value,
                "opening_hours": inputOpenHour.value,
                description: inputDescription.value,
                "sector_uuid": select.value
            }

            Api.createCompany(body)
        })
    }

    static createDepartment(companyName = "Nerds e Negócios", companyId) {
        const section = this.baseStructure()
        const form = document.createElement("form")
        const h2 = document.createElement("h2")
        const inputName = document.createElement("input")
        const inputDescription = document.createElement("input")
        const button = document.createElement("button")

        h2.classList.add("title-2")
        inputName.classList.add("input")
        inputDescription.classList.add("input")
        button.classList.add("btn")
        inputName.setAttribute("required", true)
        inputDescription.setAttribute("required", true)
        
        h2.innerText = `Criar novo departamento para\n${companyName}`
        inputName.placeholder = "Nome do departamento"
        inputDescription.placeholder = "Descrição / Ramo de atividade"
        button.innerText = "Criar departamento"

        form.append(h2, inputName, inputDescription, button)
        section.appendChild(form)

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            const body = {
                name: inputName.value,
                description: inputDescription.value,
                "company_uuid": companyId
            }

            Api.createDepartment(body)
        })
    }

    static editDepartment(department) {
        const section = this.baseStructure()
        const form = document.createElement("form")
        const h2 = document.createElement("h2")
        const inputDescription = document.createElement("input")
        const button = document.createElement("button")

        h2.classList.add("title-2")
        inputDescription.classList.add("input")
        button.classList.add("btn")
        inputDescription.setAttribute("required", true)
        
        h2.innerText = `Editar descrição do departamento\n${department.name}`
        inputDescription.placeholder = "Nova descrição"
        inputDescription.value = department.description
        button.innerText = "Salvar alterações"

        form.append(h2, inputDescription, button)
        section.appendChild(form)

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            const body = {
                description: inputDescription.value,
            }
            if(inputDescription.value == department.description) {
                Toast.erro("digite uma descrição diferente da anterior")
            } else {
                Api.editDepartment(body, department.uuid)
            }
        })

    }

    static deleteDepartment(department) {
        const section = this.baseStructure()
        const form = document.createElement("form")
        const h2 = document.createElement("h2")
        const p = document.createElement("p")
        const inputDescription = document.createElement("input")
        const button = document.createElement("button")

        h2.classList.add("title-2")
        p.classList.add("text-1")
        inputDescription.classList.add("input")
        button.classList.add("btn")
        button.classList.add("btn__red")
        inputDescription.setAttribute("required", true)
        
        h2.innerText = `Deletar departamento\n${department.name}`
        p.innerHTML = `Digite <strong>chô departamento ${department.name}</strong> para confirmar.`
        inputDescription.placeholder = "Digite aqui"
        button.innerText = "Deletar departamento"

        form.append(h2, p, inputDescription, button)
        section.appendChild(form)

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            
            if(inputDescription.value == `chô departamento ${department.name}`) {
                Api.deleteDepartment(department.uuid)
            } else {
                Toast.erro("Digite a mensagem corretamente")
            }
        })
    }

    static hireWorker(department, worker) {
        const section = this.baseStructure()
        const form = document.createElement("form")
        const h2 = document.createElement("h2")
        const p = document.createElement("p")
        const select = document.createElement("select")
        const button = document.createElement("button")

        h2.classList.add("title-2")
        p.classList.add("text-1")
        button.classList.add("btn")
        select.setAttribute("required", true)
        
        h2.innerText = `Contratar ${worker.username} para\n${department.name}`
        p.innerText = `Escolha qual será a modalidade de trabalho.`
        button.innerText = "Contratar"

        for(let element of ["modalidade de trabalho", "home office", "hibrido", "presencial"]) {
            const option = document.createElement("option")
            option.innerText = element
            option.value = element

            if(element == "modalidade de trabalho") {
                option.setAttribute("selected", true)
                option.setAttribute("disabled", true)
                option.setAttribute("hidden", true)
                option.value = ""
            }
            select.appendChild(option)
        }

        form.append(h2, p, select, button)
        section.appendChild(form)

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            const hireWorkBody = {
                "user_uuid": worker.uuid,
                "department_uuid": department.uuid
            }

            const bodyWorkType = {
                "kind_of_work": select.value
            }

            Api.changeKindOfWork(bodyWorkType, worker.uuid, hireWorkBody)
        })
    }

    static dismissWorker(worker) {
        const section = this.baseStructure()
        const form = document.createElement("form")
        const h2 = document.createElement("h2")
        const p = document.createElement("p")
        const inputDescription = document.createElement("input")
        const button = document.createElement("button")

        h2.classList.add("title-2")
        p.classList.add("text-1")
        inputDescription.classList.add("input")
        button.classList.add("btn")
        button.classList.add("btn__red")
        inputDescription.setAttribute("required", true)
        
        h2.innerText = `Demitir ${worker.username}`
        p.innerHTML = `Digite <strong>tchau ${worker.username}</strong> para confirmar.`
        inputDescription.placeholder = "Digite aqui"
        button.innerText = "Confirmar"

        form.append(h2, p, inputDescription, button)
        section.appendChild(form)

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            
            if(inputDescription.value == `tchau ${worker.username}`) {
                Api.dismissWorker(worker.uuid)
            } else {
                Toast.erro("Digite a mensagem corretamente")
            }
        })
    }
}




// <section class="modal">
//     <form>
//     <h2>Criar nova empresa</h2>
//         <input type="text" placeholder="Nome">
//         <input type="text" placeholder="Hora de abertura">
//         <input type="text" placeholder="Descrição / Slogan da empresa">
//         <select>
//             <Option></Option>
//         </select>
//         <input type="text" placeholder="Setor">
//     </form>
// </section>