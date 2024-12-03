exports.getAllAlbums = async (req, res) => {
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `MATCH (al:Album) RETURN al.title AS title, al.releaseYear AS releaseYear`
        );
        const albums = result.records.map(record => ({
            title: record.get('title'),
            releaseYear: record.get('releaseYear'),
        }));
        res.status(200).json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).send('Error fetching albums');
    } finally {
        await session.close();
    }
};

exports.addAlbum = async (req, res) => {
    const { title, releaseYear } = req.body;
    const session = req.neo4jDriver.session();

    try {
        await session.run(
            `CREATE (al:Album {title: $title, releaseYear: $releaseYear}) RETURN al`,
            { title, releaseYear }
        );
        res.status(201).send('Album added successfully');
    } catch (error) {
        console.error('Error adding album:', error);
        res.status(500).send('Error adding album');
    } finally {
        await session.close();
    }
};

exports.deleteAlbum = async (req, res) => {
    const { title } = req.params; // Assuming the album title is passed as a URL parameter
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `MATCH (al:Album {title: $title})
             DETACH DELETE al`,
            { title }
        );

        if (result.summary.counters.nodesDeleted === 0) {
            return res.status(404).send('Album not found');
        }

        res.status(200).send('Album deleted successfully');
    } catch (error) {
        console.error('Error deleting album:', error);
        res.status(500).send('Error deleting album');
    } finally {
        await session.close();
    }
};
