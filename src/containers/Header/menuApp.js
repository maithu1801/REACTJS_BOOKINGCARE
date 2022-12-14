export const adminMenu = [
    { //quan ly nguoi dung
        name: 'menu.admin.manage-user',
        menus: [
            // {
            //     name: 'menu.admin.crud', link: '/system/user-manage'
            // },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },

            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },

        ]
    },
    {//quan ly phong kham
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            },
        ]

    },
    {//quan ly chuyen khoa
        name: 'menu.admin.manage-specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },
        ]
    },
    {//quan ly thuoc
        name: 'Quản lý thuốc',
        menus: [
            {
                name: 'Kho thuốc', link: '/system/manage-medicine'
            },
        ]
    },
    {//quan ly lich hen
        name: 'Quản lý lịch hẹn',
        menus: [
            {
                name: 'Danh sách lịch hẹn', link: '/system/manage-schedule'
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            {//quan ly ke hoach kham benh cua bac si
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            {//quan ly benh nhan kham benh cua bac si
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
            },
        ]
    },
    {
        name: 'menu.doctor.manage-medicine',
        menus: [
            {//quan ly kho thuoc
                name: 'menu.doctor.medicine-store', link: '/doctor/manage-medicine'
            },
        ]
    }
]