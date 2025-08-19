import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/lib/mongoose';
import Client from '@/lib/models/Client';
import { withAuth } from '@/lib/withAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Authentication is now handled by the withAuth wrapper.
  
  await connectToDB();
  const { method } = req;
  const { clientId } = req.query; // This will be an array, e.g., ['some-id']

  switch (method) {
    case 'GET':
      try {
        if (clientId && clientId.length > 0) {
          const client = await Client.findById(clientId[0]);
          if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
          }
          return res.status(200).json({ success: true, data: client });
        } else {
          const clients = await Client.find({}).sort({ name: 1 });
          return res.status(200).json({ success: true, data: clients });
        }
      } catch (error) {
        console.error('GET /api/clients error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch client(s).' });
      }

    case 'POST':
      try {
        const newClient = await Client.create(req.body);
        return res.status(201).json({ success: true, data: newClient });
      } catch (error) {
        console.error('POST /api/clients error:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
          return res.status(400).json({ success: false, message: error.message });
        }
        // Handle duplicate key errors for the unique email field
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
          return res.status(409).json({ success: false, message: 'A client with this email already exists.' });
        }
        return res.status(500).json({ success: false, message: 'Failed to create client.' });
      }

    case 'PUT':
      try {
        if (!clientId || clientId.length === 0) {
          return res.status(400).json({ success: false, message: 'Client ID is required for update.' });
        }
        const updatedClient = await Client.findByIdAndUpdate(clientId[0], req.body, {
          new: true,
          runValidators: true,
        });

        if (!updatedClient) {
          return res.status(404).json({ success: false, message: 'Client not found.' });
        }
        return res.status(200).json({ success: true, data: updatedClient });
      } catch (error) {
        console.error('PUT /api/clients error:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
          return res.status(400).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: 'Failed to update client.' });
      }

    case 'DELETE':
      try {
        if (!clientId || clientId.length === 0) {
          return res.status(400).json({ success: false, message: 'Client ID is required for deletion.' });
        }
        const deletedClient = await Client.findByIdAndDelete(clientId[0]);
        if (!deletedClient) {
          return res.status(404).json({ success: false, message: 'Client not found.' });
        }
        return res.status(204).end();
      } catch (error: unknown) {
        console.error('DELETE /api/clients error:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete client.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).end(`Method ${method} Not Allowed`);
  }
}

export default withAuth(handler);
