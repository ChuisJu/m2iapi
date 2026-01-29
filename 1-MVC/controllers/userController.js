const User = require("../models/User");

const userController = {
    getAllUsers: (req, res) => {
        User.getAll((err, users) => {
            if(err) {
                return res.status(500).json({error:err.message})
            }
            res.json(users)
        });
    },

    getUserById: (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "id invalide (doit être un entier)" });
    }

    User.getById(id, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json(user);
    });
    },


    createUser: (req, res) => {
        const { name, email } = req.body;
        User.create(name, email, (err, id) => {
            if(err) {
                return res.status(500).json({error:err.message})
            }
            res.status(201).json({id, name, email});
        })
    },

    updateUser: (req,res) => {
        const id = req.params.id;
        const {name,email} = req.body;

        User.update(id, name, email, (err) => {
            if(err) {
                return res.status(500).json({error:err.message})
            }

            res.status(201).json({message:"user updated"});
        })
    },

    deleteUser: (req, res) => {
        const id = req.params.id;
        User.delete(id, (err) => {
            if(err) {
                return res.status(500).json({error:err.message})
            }
            res.status(201).json({message:"user deleted"});
        })
    }
}

module.exports = userController;