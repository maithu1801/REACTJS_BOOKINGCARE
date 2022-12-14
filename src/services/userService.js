import axios from '../axios';

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}
const editUserService = (inputData) => {
    console.log('nhan ve editUserService', inputData)
    return axios.put('/api/edit-user', inputData)
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}
const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}
const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctors', data);
}
//////
const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctors-by-id?id=${inputId}`)
}
const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}
const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}
const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
const postPatientBookingAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}
const createNewSpecialty = (data) => {
    return axios.post(`/api/create-new-specialty`, data)
}
const getAllSpecialty = () => {
    return axios.get(`/api/get-specialty`)
}
const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}
const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}
const getAllClinic = () => {
    return axios.get(`/api/get-clinic`)
}
const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}
const getAllPatientDoctor = async (data) => {
    let nhanve = await axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
    return nhanve;
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data)
}
const createHistory = (data) => {
    return axios.post(`/api/create-history`, data);
}
const getListHistory = (data) => {
    return axios.post(`/api/history-patient`, data);
}
const searchPatient = (data) => {
    return axios.post(`/api/search-patient`, data);
}

const manageMedicine = (data) => {
    return axios.post(`/api/medicines-manage`, data);
}
const getDoctor = () => {
    return axios.get(`/api/get-doctor`)
}
const postSendEmail = (data) => {
    console.log('gui di', data);
    return axios.post('/api/send-email-login', data);
}
const postVerifyChangeLogin = (data) => {
    return axios.post(`/api/verify-change-login`, data)
}
const editUserPassword = (inputData) => {
    return axios.post('/api/edit-user-change', inputData)
}
const getScheduleManage = (data) => {
    return axios.post('/api/get-Schedule-Manage', data)
}
const listManage = (data) => {
    return axios.post(`/api/list-manage`, data);
}
const adminManageSchedule = (data) => {
    return axios.post(`/api/admin-manage-schedule`, data);
}
export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctorService,
    getDetailInforDoctor,
    saveBulkScheduleDoctor,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    postPatientBookingAppointment,
    postVerifyBookAppointment,
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getAllClinic,
    getDetailClinicById,
    getAllPatientDoctor,
    postSendRemedy,
    getListHistory,
    createHistory,
    searchPatient,
    manageMedicine,
    getDoctor,
    postSendEmail,
    postVerifyChangeLogin,
    editUserPassword,
    getScheduleManage,
    listManage,
    adminManageSchedule
}