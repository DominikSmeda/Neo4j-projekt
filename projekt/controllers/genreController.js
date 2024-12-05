exports.getAllGenres = async (req, res) => {
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(`MATCH (g:Genre) RETURN g.name AS name`);
        const genres = result.records.map(record => ({ name: record.get('name') }));
        res.status(200).json(genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).send('Error fetching genres');
    } finally {
        await session.close();
    }
};

exports.addGenre = async (req, res) => {
    const { name } = req.body;
    const session = req.neo4jDriver.session();

    try {
        await session.run(`CREATE (g:Genre {name: $name}) RETURN g`, { name });
        res.status(201).send('Genre added successfully');
    } catch (error) {
        console.error('Error adding genre:', error);
        res.status(500).send('Error adding genre');
    } finally {
        await session.close();
    }
};

exports.deleteGenre = async (req, res) => {
    const { name } = req.params;
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `MATCH (g:Genre {name: $name})
             DETACH DELETE g`,
            { name }
        );

        if (result.summary.counters.nodesDeleted === 0) {
            return res.status(404).send('Genre not found');
        }

        res.status(200).send('Genre deleted successfully');
    } catch (error) {
        console.error('Error deleting genre:', error);
        res.status(500).send('Error deleting genre');
    } finally {
        await session.close();
    }
};