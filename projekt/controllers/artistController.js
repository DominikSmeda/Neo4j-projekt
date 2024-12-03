exports.getAllArtists = async (req, res) => {
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(`MATCH (a:Artist) RETURN a.name AS name`);
        const artists = result.records.map(record => ({ name: record.get('name') }));
        res.status(200).json(artists);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).send('Error fetching artists');
    } finally {
        await session.close();
    }
};

exports.addArtist = async (req, res) => {
    const { name } = req.body;
    const session = req.neo4jDriver.session();

    try {
        await session.run(`CREATE (a:Artist {name: $name}) RETURN a`, { name });
        res.status(201).send('Artist added successfully');
    } catch (error) {
        console.error('Error adding artist:', error);
        res.status(500).send('Error adding artist');
    } finally {
        await session.close();
    }
};

exports.deleteArtist = async (req, res) => {
    const { name } = req.params; // Assuming the artist name is passed as a URL parameter
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `MATCH (a:Artist {name: $name})
             DETACH DELETE a`,
            { name }
        );

        if (result.summary.counters.nodesDeleted === 0) {
            return res.status(404).send('Artist not found');
        }

        res.status(200).send('Artist deleted successfully');
    } catch (error) {
        console.error('Error deleting artist:', error);
        res.status(500).send('Error deleting artist');
    } finally {
        await session.close();
    }
};
