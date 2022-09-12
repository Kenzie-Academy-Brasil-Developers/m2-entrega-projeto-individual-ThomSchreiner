import { Render } from "./render.js"
import { Toast } from "./toast.js"

export class Api {
    static urlBase = "http://localhost:6278"
    static token = localStorage.getItem("@kenzieEmpresas:token")
    static header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`
    }
    static async tratarErroFetch(resp) {
        if(resp.ok) {
            return resp.json()
        } else {
            const data = await resp.json()
            Toast.erro(data.error)
            throw new Error(data.error)
        }
    }

    static login(body, redirect = false) {
        fetch(`${this.urlBase}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        .then(async (resp) => this.tratarErroFetch(resp))
        .then(resp => {
            localStorage.setItem("@kenzieEmpresas:token", resp.token)
            localStorage.setItem("@kenzieEmpresas:is_admin", resp.is_admin)
            localStorage.setItem("@kenzieEmpresas:uuid", resp.uuid)
            window.location.replace(redirect ? "../dashboard/dashboard.html" : "./src/pages/dashboard/dashboard.html")
            return resp
        })
        .catch(erro => console.log(erro))
    }

    static signup(body) {
        fetch(`${this.urlBase}/auth/register/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        .then(resp => this.tratarErroFetch(resp))
        .then(resp => {
            this.login(body, true)
            return resp
        })
        .catch(erro => console.log(erro))
    }

    static async getAllCompanies() {
        const companies = await fetch(`${this.urlBase}/companies`, {
                method: "GET",
                headers: this.header
            })
            .then(resp => this.tratarErroFetch(resp))
            .then(resp => resp)
            .catch(erro => console.log(erro))
        return companies
    }

    static async getDepartmentsOfOneCompany(companyId) {
        const department = await fetch(`${this.urlBase}/departments/${companyId}`, {
                method: "GET",
                headers: this.header
            })
            .then(resp => this.tratarErroFetch(resp))
            .then(resp => resp)
            .catch(erro => console.log(erro))
        return department
    }

    static createDepartment(body) {
        fetch(`${this.urlBase}/departments`, {
            method: "POST",
            headers: this.header,
            body: JSON.stringify(body)
        })
        .then(resp => this.tratarErroFetch(resp))
        .then(resp => resp)
        .catch(erro => console.log(erro))
    }

    static getAllWorkers() {
        const user = fetch(`${this.urlBase}/users`, {
                method: "GET",
                headers: this.header
            })
            .then(resp => this.tratarErroFetch(resp))
            .then(resp => resp)
            .catch(erro => console.log(erro))
        return user
    }

    static editDepartment(body, departmentId) {
        fetch(`${this.urlBase}/departments/${departmentId}`, {
            method: "PATCH",
            headers: this.header,
            body: JSON.stringify(body)
        })
        .then(resp => this.tratarErroFetch(resp))
        .then(resp => resp)
        .catch(erro => console.log(erro))
    }

    static deleteDepartment(departmentId) {
        fetch(`${this.urlBase}/departments/${departmentId}`, {
            method: "DELETE",
            headers: this.header
        })
        .then(resp => resp)
        .catch(erro => console.log(erro))
    }
    
    static changeKindOfWork(body, userId, hireWorkBody = false) {
        fetch(`${this.urlBase}/admin/update_user/${userId}`, {
            method: "PATCH",
            headers: this.header,
            body: JSON.stringify(body)
        })
        .then(resp => this.tratarErroFetch(resp))
        .then(resp => {
            if(hireWorkBody) {
                this.hireWorker(hireWorkBody)
            }
            return resp
        })
        .catch(erro => console.log(erro))
    }

    static hireWorker(body) {
        fetch(`${this.urlBase}/departments/hire/`, {
            method: "PATCH",
            headers: this.header,
            body: JSON.stringify(body)
        })
        .then(resp => this.tratarErroFetch(resp))
        .then(resp => console.log(resp))
        .catch(erro => console.log(erro))
    }

    static dismissWorker(workerId) {
        fetch(`${this.urlBase}/departments/dismiss/${workerId}`, {
            method: "PATCH",
            headers: this.header
        })
        .then(resp => resp)
        .catch(erro => console.log(erro))
    }

    static async getCompanyOfUserActual() {
        const company = await fetch(`${this.urlBase}/users/departments`, {
                method: "GET",
                headers: this.header
            })
            .then(resp => this.tratarErroFetch(resp))
            .then(resp => resp)
            .catch(erro => {
                console.log(erro)
                Render.userWithoutDepartment()
            })
        return company
    }

    static async getCoWorkers() {
        const coWorkers = await fetch(`${this.urlBase}/users/departments/coworkers`, {
                method: "GET",
                headers: this.header
            })
            .then(resp => this.tratarErroFetch(resp))
            .then(resp => resp)
            .catch(erro => console.log(erro))
        return coWorkers
    }
}