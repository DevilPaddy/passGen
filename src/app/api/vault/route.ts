import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../../lib/db';
import Store from '../../../../models/store';
import { getUser } from '../../../../lib/userDet';
import { encryptPassword, decryptPassword } from '../../../../utils/encryption';

connect();

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const items = await Store.find({ userId: user.userId }).sort({ createdAt: -1 });

    // Decrypt passwords before sending to client
    const decryptedItems = items.map(item => ({
      ...item.toObject(),
      pass: decryptPassword(item.pass),
    }));

    return NextResponse.json(decryptedItems);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch vault items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { appName, pass } = body;

    if (!appName || !pass) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Encrypt password before saving
    const encryptedPass = encryptPassword(pass);

    const newItem = await Store.create({ userId: user.userId, appName, pass: encryptedPass });

    // Send decrypted password back to client
    return NextResponse.json({ ...newItem.toObject(), pass }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save vault item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, appName, pass } = body;

    if (!id || !appName || !pass) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const encryptedPass = encryptPassword(pass);

    const updatedItem = await Store.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { appName, pass: encryptedPass },
      { new: true }
    );

    if (!updatedItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    return NextResponse.json({ ...updatedItem.toObject(), pass });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update vault item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const deletedItem = await Store.findOneAndDelete({ _id: id, userId: user.userId });
    if (!deletedItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete vault item' }, { status: 500 });
  }
}
