
class User {
    constructor(email, password, categoria) {
        this.email = email;
        this.password = password;
        this.categoria = categoria;
    }

    static setConnection(connection) {
        User.connection = connection;
    }

    static async createUser(userData) {
        const { email, password, categoria } = userData;
        const [result] = await User.connection.query(
            'INSERT INTO User (email, password, categoria) values (?, ?, ?)', 
            [email, password, categoria]
        );

        const userId = result.insertId;
        if (categoria === 'admin') {
            await User.connection.query(
                'INSERT INTO Administrador (userId) VALUES (?)',
                [userId]
            );
        }

        return { id: userId, ...userData };
    }

    static async updateUser(id, userId) {
        const { email, password, categoria } = userId;
        await User.connection.query('UPDATE User SET email=?, password=?, categoria=? WHERE id=?' [email, password, categoria, userId]);
        return { id, ...userId };
    }

    static async deleteUser(userId) {
        await User.connection.query('DELETE FROM User WHERE id=?', [userId]);
    }

    static async findUserById(id) {
        const [rows] = await User.connection.query('SELECT * FROM User WHERE id=?', [id]);
        return rows[0];
    }

    static async findAllUsers() {
        const [rows] = await User.connection.query('SELECT * FROM User');
        return rows;
    }
}

export default User;

