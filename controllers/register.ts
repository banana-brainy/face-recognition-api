// This route is registering the user and making a call to the DB,
// checking whether the user is already registered.

// I have two options: make explicit imports
// or make imports to be passed as parameters.

// Trying out the first method, which should at least work.

// The first 'simple' method didn't work, because of
// req.body has had some messed up type:
// Body.body: ReadableStream<Uint8Array> | null

// Let's try the option, which wasn't working previously.
// This is the option of a dependency injection.

// The obvious errors were fixed very freaking fast with 
// the help of 'any' type, so it was definetly inefficient.
// However, some nice insights were revealed: the DB has got the request.
// Although, my routing didn't manage to open the home page
// with user's name and rank (hash worked too btw).

// So now I need to look at the code and try figuring out
// why the routing didn't manage, while the DB got it.

interface IUserForDatabase {
    id: string,
    name: string,
    email: string,
    password: string,
}

const handleRegister = (req: Request, res: Response, db: any, bcrypt: any) => {
    const { email, name, password }: any = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
        return db.transaction((trx: any) => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then((loginEmail: any) => {
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then((user: any) => {
                    res.json();
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
            })
            .catch((err: any) => res.json())
}

module.exports = {
    handleRegister: handleRegister
}
