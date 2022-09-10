import { Api } from "./api.js"

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

    static createCompany(form) {

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