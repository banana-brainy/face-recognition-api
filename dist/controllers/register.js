"use strict";
// This route is registering the user and making a call to the DB,
// checking whether the user is already registered.
const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return db.transaction((trx) => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then((loginEmail) => {
            return trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
                .then((user) => {
                res.json();
            });
        })
            .then(trx.commit)
            .catch(trx.rollback);
    })
        .catch((err) => res.json());
};
module.exports = {
    handleRegister: handleRegister
};
