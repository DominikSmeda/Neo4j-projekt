exports.getAllTracks = async (req, res) => {
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `MATCH (t:Track)
             OPTIONAL MATCH (t)-[:PERFORMED_BY]->(a:Artist)
             OPTIONAL MATCH (t)-[:PART_OF]->(al:Album)
             OPTIONAL MATCH (t)-[:BELONGS_TO]->(g:Genre)
             RETURN t.title AS title, t.duration AS duration, 
                    a.name AS artistName, al.title AS albumName, g.name AS genreName`
        );

        const tracks = result.records.map(record => ({
            title: record.get('title'),
            duration: record.get('duration'),
            artist: record.get('artistName') || 'Unknown',
            album: record.get('albumName') || 'Unknown',
            genre: record.get('genreName') || 'Unknown',
        }));

        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).send('Error fetching tracks');
    } finally {
        await session.close();
    }
};

exports.addTrack = async (req, res) => {
    const { title, duration, artist, album, genre } = req.body;
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `MERGE (a:Artist {name: $artist})
             MERGE (al:Album {title: $album})
             MERGE (g:Genre {name: $genre})
             CREATE (t:Track {title: $title, duration: $duration})
             MERGE (t)-[:PERFORMED_BY]->(a)
             MERGE (t)-[:PART_OF]->(al)
             MERGE (t)-[:BELONGS_TO]->(g)
             RETURN t`,
            { title, duration, artist, album, genre }
        );

        res.status(201).send('Track added successfully');
    } catch (error) {
        console.error('Error adding track:', error);
        res.status(500).send('Error adding track');
    } finally {
        await session.close();
    }
};

exports.getTracksByArtist = async (req, res) => {
    const { artistName } = req.params;
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `
            MATCH (ar:Artist {name: $artistName})<-[:PERFORMED_BY]-(t:Track)
            OPTIONAL MATCH (t)-[:PART_OF]->(a:Album)
            OPTIONAL MATCH (t)-[:BELONGS_TO]->(g:Genre)
            RETURN 
                t.title AS trackTitle, 
                t.duration AS trackDuration, 
                ar.name AS artistName, 
                a.title AS albumName, 
                g.name AS genreName
            `,
            { artistName }
        );

        const tracks = result.records.map(record => ({
            title: record.get('trackTitle'),
            duration: record.get('trackDuration'),
            artist: record.get('artistName'),
            album: record.get('albumName'),
            genre: record.get('genreName'),
        }));

        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error fetching tracks by artist:', error);
        res.status(500).send('Error fetching tracks by artist');
    } finally {
        await session.close();
    }
};

exports.getTracksByGenre = async (req, res) => {
    const { genreName } = req.params;
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `
            MATCH (g:Genre {name: $genreName})<-[:BELONGS_TO]-(t:Track)
            OPTIONAL MATCH (t)-[:PART_OF]->(a:Album)
            OPTIONAL MATCH (t)-[:PERFORMED_BY]->(ar:Artist)
            RETURN 
                t.title AS trackTitle, 
                t.duration AS trackDuration, 
                ar.name AS artistName, 
                a.title AS albumName, 
                g.name AS genreName
            `,
            { genreName }
        );

        const tracks = result.records.map(record => ({
            title: record.get('trackTitle'),
            duration: record.get('trackDuration'),
            artist: record.get('artistName'),
            album: record.get('albumName'),
            genre: record.get('genreName'),
        }));

        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error fetching tracks by genre:', error);
        res.status(500).send('Error fetching tracks by genre');
    } finally {
        await session.close();
    }
};

exports.getTracksByAlbum = async (req, res) => {
    const { albumName } = req.params;
    const session = req.neo4jDriver.session();
    console.log(albumName)
    try {
        const result = await session.run(
            `
            MATCH (al:Album {title: $albumName})<-[:PART_OF]-(t:Track)
            OPTIONAL MATCH (t)-[:PERFORMED_BY]->(a:Artist)
            OPTIONAL MATCH (t)-[:BELONGS_TO]->(g:Genre)
            RETURN 
                t.title AS trackTitle, 
                t.duration AS trackDuration, 
                a.name AS artistName, 
                g.name AS genreName
            `,
            { albumName }
        );

        console.log(result)
        const tracks = result.records.map(record => ({
            title: record.get('trackTitle'),
            duration: record.get('trackDuration'),
            artist: record.get('artistName') || 'Unknown',
            genre: record.get('genreName') || 'Unknown',
            album: albumName
        }));

        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error fetching tracks by album:', error);
        res.status(500).send('Error fetching tracks by album');
    } finally {
        await session.close();
    }
};

exports.deleteTrack = async (req, res) => {
    const { title } = req.params; // Assuming the track title is passed as a URL parameter
    const session = req.neo4jDriver.session();

    try {
        const result = await session.run(
            `MATCH (t:Track {title: $title})
             DETACH DELETE t`,
            { title }
        );

        if (result.summary.counters.nodesDeleted === 0) {
            return res.status(404).send('Track not found');
        }

        res.status(200).send('Track deleted successfully');
    } catch (error) {
        console.error('Error deleting track:', error);
        res.status(500).send('Error deleting track');
    } finally {
        await session.close();
    }
};