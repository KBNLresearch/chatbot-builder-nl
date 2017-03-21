export default {
    root: () => "/",
    dialogEdit: (id) => id
        ? `/dialog-edit/${id}`
        : "/dialog-edit/:id"
};
